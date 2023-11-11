package io.wordies.crossword;

import static org.apache.logging.log4j.Level.ERROR;

import io.wordies.component.ExecutorComponent;
import io.wordies.config.PropertiesConfig;
import io.wordies.crossword.model.Orientation;
import io.wordies.crossword.model.Position;
import io.wordies.crossword.model.Question;
import io.wordies.crossword.model.crossword.*;
import io.wordies.crossword.repository.CrosswordRepository;
import io.wordies.util.ErrorUtils;
import io.wordies.util.structure.BlockingConcurrentPercentileSampler;
import java.util.*;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CrosswordService {
  private static final Logger LOGGER = LogManager.getLogger(CrosswordService.class);
  private final Random random = new Random();
  private final CrosswordRepository crosswordRepository;
  private final CrosswordFactory crosswordFactory;

  private final double qualityAssuranceThreshold;
  private final BlockingConcurrentPercentileSampler<Crossword> crosswordPercentileSampler;
  private final ExecutorComponent executorComponent;

  @Autowired
  public CrosswordService(
      CrosswordRepository crosswordRepository,
      PropertiesConfig propertiesConfig,
      ExecutorComponent executorComponent) {
    this.crosswordRepository = crosswordRepository;
    this.crosswordFactory = new CrosswordFactory(crosswordRepository, crosswordRepository);
    this.crosswordFactory.setWidth(propertiesConfig.getCrosswordParametersWidth());
    this.crosswordFactory.setHeight(propertiesConfig.getCrosswordParametersHeight());
    this.crosswordFactory.setMinWordLength(propertiesConfig.getCrosswordParametersWordLengthMin());
    this.crosswordFactory.setMaxWordLength(propertiesConfig.getCrosswordParametersWordLengthMax());
    this.crosswordFactory.setMaxOffset(propertiesConfig.getCrosswordParametersOffsetMax());
    this.qualityAssuranceThreshold = propertiesConfig.getCrosswordQualityAssuranceThreshold();
    this.crosswordPercentileSampler =
        new BlockingConcurrentPercentileSampler<>(
            propertiesConfig.getCrosswordQualityAssuranceSampleSizeMin(),
            propertiesConfig.getCrosswordQualityAssuranceSampleSizeMax());
    this.executorComponent = executorComponent;
    for (int i = 0; i < propertiesConfig.getCrosswordWorkers(); i++) {
      executorComponent.runOnLoop(
          () -> {
            Crossword crossword = crosswordFactory.getRandomCrossword(random);
            try {
              crosswordPercentileSampler.offer(
                  crossword, getCrosswordQualityCoefficient(crossword));
            } catch (InterruptedException e) {
              LOGGER.log(ERROR, ErrorUtils.toErrorMessage(e));
            }
          });
    }
  }

  public Crossword getRandomCrossword() {
    try {
      return crosswordPercentileSampler.poll(qualityAssuranceThreshold);
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
}
