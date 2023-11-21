package io.wordies.crossword;

import static org.apache.logging.log4j.Level.ERROR;

import io.wordies.component.ExecutorComponent;
import io.wordies.config.PropertiesConfig;
import io.wordies.crossword.model.Orientation;
import io.wordies.crossword.model.Position;
import io.wordies.crossword.model.Question;
import io.wordies.crossword.model.crossword.*;
import io.wordies.crossword.repository.CrosswordRepository;
import io.wordies.util.CollectionUtils;
import io.wordies.util.ErrorUtils;
import java.util.*;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CrosswordService {
  private static final Logger LOGGER = LogManager.getLogger(CrosswordService.class);
  private final Random random = new Random();
  private final CrosswordFactory crosswordFactory;

  private final BlockingQueue<Crossword> crosswordBacklog;

  @Autowired
  public CrosswordService(
      CrosswordRepository crosswordRepository,
      PropertiesConfig propertiesConfig,
      ExecutorComponent executorComponent) {
    this.crosswordFactory = new CrosswordFactory(crosswordRepository, crosswordRepository);
    this.crosswordFactory.setWidth(propertiesConfig.getCrosswordParametersWidth());
    this.crosswordFactory.setHeight(propertiesConfig.getCrosswordParametersHeight());
    this.crosswordFactory.setMinWordLength(propertiesConfig.getCrosswordParametersWordLengthMin());
    this.crosswordFactory.setMaxWordLength(propertiesConfig.getCrosswordParametersWordLengthMax());
    this.crosswordFactory.setMaxOffset(propertiesConfig.getCrosswordParametersOffsetMax());
    this.crosswordBacklog = new LinkedBlockingQueue<>(propertiesConfig.getCrosswordBacklogSize());
    for (int i = 0; i < propertiesConfig.getCrosswordWorkers(); i++) {
      executorComponent.runOnLoop(
          new Worker(
              propertiesConfig.getCrosswordQualityAssuranceSampleSize(),
              propertiesConfig.getCrosswordQualityAssuranceAcceptablePercentile()));
    }
  }

  public Crossword getRandomCrossword() {
    try {
      return crosswordBacklog.take();
    } catch (InterruptedException e) {
      throw new RuntimeException(e);
    }
  }

  private double getCrosswordQualityCoefficient(Crossword crossword) {
    double uniformityCoefficient = getCrosswordUniformityCoefficient(crossword);
    double densityCoefficient = getCrosswordDensityCoefficient(crossword);
    double connectivityCoefficient = getCrosswordConnectivityCoefficient(crossword);
    // Square uniformity coefficient to punish crosswords with low uniformity.
    // Double the density coefficient as we want dense crosswords more than we want uniform ones.
    // Quadruple the connectivity coefficient as we want connected crosswords more than we want
    // dense ones.
    return uniformityCoefficient * uniformityCoefficient
        + 2.0 * densityCoefficient
        + 4.0 * connectivityCoefficient;
  }

  private double getCrosswordUniformityCoefficient(Crossword crossword) {
    long numRows =
        crossword.questions().stream()
            .map(Question::orientation)
            .filter(orientation -> orientation == Orientation.ACROSS)
            .count();
    long numColumns =
        crossword.questions().stream()
            .map(Question::orientation)
            .filter(orientation -> orientation == Orientation.DOWN)
            .count();
    long delta = Math.abs(numRows - numColumns);
    long max = Math.max(numRows, numColumns);
    return 1.0 - delta / (double) max;
  }

  private double getCrosswordDensityCoefficient(Crossword crossword) {
    long occupiedTiles =
        crossword.questions().stream().map(Question::answer).mapToLong(String::length).sum();
    long gridSize = (long) crossword.width() * crossword.height();
    return occupiedTiles / (double) gridSize;
  }

  private double getCrosswordConnectivityCoefficient(Crossword crossword) {
    int nextGroupIndex = 0;
    Map<Position, Integer> positionToGroupIndexMap = new HashMap<>();
    Map<Integer, Set<Position>> groupIndexToPositionsMap = new HashMap<>();
    for (Question question : crossword.questions()) {
      int groupIndex = nextGroupIndex++;
      Set<Position> positions = new HashSet<>();
      groupIndexToPositionsMap.put(groupIndex, positions);
      for (int i = 0; i < question.answer().length(); i++) {
        Position position = question.position().translate(i, question.orientation());
        Integer intersectingGroupIndex = positionToGroupIndexMap.get(position);
        positions.add(position);
        positionToGroupIndexMap.put(position, groupIndex);
        if (intersectingGroupIndex != null && intersectingGroupIndex != groupIndex) {
          Set<Position> intersectingPositions =
              groupIndexToPositionsMap.remove(intersectingGroupIndex);
          positions.addAll(intersectingPositions);
          for (Position intersectingPosition : intersectingPositions) {
            positionToGroupIndexMap.replace(intersectingPosition, groupIndex);
          }
        }
      }
    }
    return 1.0 / (double) groupIndexToPositionsMap.size();
  }

  private class ComparableCrossword implements Comparable<ComparableCrossword> {

    private final Crossword crossword;
    private final double qualityCoefficient;

    private ComparableCrossword(Crossword crossword) {
      this.crossword = crossword;
      this.qualityCoefficient = getCrosswordQualityCoefficient(crossword);
    }

    public Crossword getCrossword() {
      return crossword;
    }

    @Override
    public int compareTo(ComparableCrossword that) {
      return Double.compare(that.qualityCoefficient, this.qualityCoefficient);
    }
  }

  private class Worker implements Runnable {
    private final int sampleSize;
    private final int acceptableThreshold;

    private Worker(int sampleSize, double acceptablePercentile) {
      this.sampleSize = sampleSize;
      this.acceptableThreshold = (int) (sampleSize * acceptablePercentile);
    }

    @Override
    public void run() {
      List<ComparableCrossword> comparableCrosswords = new ArrayList<>(sampleSize);
      for (int i = 0; i < sampleSize; i++) {
        Crossword crossword = crosswordFactory.getRandomCrossword(random);
        comparableCrosswords.add(new ComparableCrossword(crossword));
      }
      comparableCrosswords = CollectionUtils.sortN(comparableCrosswords, acceptableThreshold);
      Collections.shuffle(comparableCrosswords, random);
      for (ComparableCrossword comparableCrossword : comparableCrosswords) {
        try {
          crosswordBacklog.put(comparableCrossword.getCrossword());
        } catch (InterruptedException e) {
          LOGGER.log(ERROR, ErrorUtils.toErrorMessage(e));
        }
      }
    }
  }
}
