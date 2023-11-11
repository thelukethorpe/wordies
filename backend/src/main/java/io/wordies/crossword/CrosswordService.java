package io.wordies.crossword;

import io.wordies.config.PropertiesConfig;
import io.wordies.crossword.model.Orientation;
import io.wordies.crossword.model.Position;
import io.wordies.crossword.model.Question;
import io.wordies.crossword.model.crossword.*;
import io.wordies.crossword.repository.CrosswordRepository;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CrosswordService {
  private final Random random = new Random();
  private final CrosswordRepository crosswordRepository;
  private final int width,
      height,
      minWordLength,
      maxWordLength,
      maxOffset,
      qualityAssuranceSampleSize;

  @Autowired
  public CrosswordService(
      CrosswordRepository crosswordRepository, PropertiesConfig propertiesConfig) {
    this.crosswordRepository = crosswordRepository;
    this.width = propertiesConfig.getCrosswordParametersWidth();
    this.height = propertiesConfig.getCrosswordParametersHeight();
    this.minWordLength = propertiesConfig.getCrosswordParametersWordLengthMin();
    this.maxOffset = propertiesConfig.getCrosswordParametersOffsetMax();
    this.maxWordLength = propertiesConfig.getCrosswordParametersWordLengthMax();
    this.qualityAssuranceSampleSize = propertiesConfig.getCrosswordQualityAssuranceSampleSize();
  }

  public Crossword getRandomCrossword() {
    TreeMap<Double, Crossword> qualityCoefficientToCrosswordMap = new TreeMap<>();
    SnakeCrosswordPainter snakeCrosswordPainter = new SnakeCrosswordPainter();
    snakeCrosswordPainter.setMinWordLength(minWordLength);
    snakeCrosswordPainter.setMaxWordLength(maxWordLength);
    CrissCrossCrosswordPainter crissCrossCrosswordPainter = new CrissCrossCrosswordPainter();
    crissCrossCrosswordPainter.setMinWordLength(minWordLength);
    crissCrossCrosswordPainter.setMaxWordLength(maxWordLength);
    crissCrossCrosswordPainter.setMaxOffset(maxOffset);
    for (int i = 0; i < qualityAssuranceSampleSize; i++) {
      RandomCrosswordBuilder builder = new RandomCrosswordBuilder(width, height);
      snakeCrosswordPainter.paintCrossword(
          builder, random, crosswordRepository, crosswordRepository);
      crissCrossCrosswordPainter.paintCrossword(
          builder, random, crosswordRepository, crosswordRepository);
      Crossword crossword = builder.build();
      double qualityCoefficient = getCrosswordQualityCoefficient(crossword);
      qualityCoefficientToCrosswordMap.put(qualityCoefficient, crossword);
    }
    return qualityCoefficientToCrosswordMap.lastEntry().getValue();
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
