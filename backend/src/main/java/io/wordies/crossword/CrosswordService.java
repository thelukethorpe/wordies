package io.wordies.crossword;

import io.wordies.config.PropertiesConfig;
import io.wordies.crossword.model.Orientation;
import io.wordies.crossword.model.Question;
import io.wordies.crossword.model.crossword.Crossword;
import io.wordies.crossword.model.crossword.RandomCrosswordFactory;
import io.wordies.crossword.repository.CrosswordRepository;
import java.util.Random;
import java.util.TreeMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CrosswordService {

  private static final int MAX_OFFSET = 1;

  private final Random random = new Random();
  private final CrosswordRepository crosswordRepository;
  private final int qualityAssuranceSampleSize;

  @Autowired
  public CrosswordService(
      CrosswordRepository crosswordRepository, PropertiesConfig propertiesConfig) {
    this.crosswordRepository = crosswordRepository;
    qualityAssuranceSampleSize = propertiesConfig.getCrosswordQualityAssuranceSampleSize();
  }

  public Crossword getRandomCrossword(int width, int height, int minWordLength, int maxWordLength) {
    TreeMap<Double, Crossword> qualityCoefficientToCrosswordMap = new TreeMap<>();
    RandomCrosswordFactory randomCrosswordFactory = new RandomCrosswordFactory();
    randomCrosswordFactory.setWidth(width);
    randomCrosswordFactory.setHeight(height);
    randomCrosswordFactory.setMinWordLength(minWordLength);
    randomCrosswordFactory.setMaxWordLength(maxWordLength);
    randomCrosswordFactory.setMaxOffset(MAX_OFFSET);
    for (int i = 0; i < qualityAssuranceSampleSize; i++) {
      Crossword crossword =
          randomCrosswordFactory.getRandomCrossword(
              random, crosswordRepository, crosswordRepository);
      double qualityCoefficient = getCrosswordQualityCoefficient(crossword);
      qualityCoefficientToCrosswordMap.put(qualityCoefficient, crossword);
    }
    return qualityCoefficientToCrosswordMap.lastEntry().getValue();
  }

  private double getCrosswordQualityCoefficient(Crossword crossword) {
    double uniformityCoefficient = getCrosswordUniformityCoefficient(crossword);
    double densityCoefficient = getCrosswordDensityCoefficient(crossword);
    // Square uniformity coefficient to punish crosswords with low uniformity.
    // Double the density coefficient as we want dense crosswords more than we want uniform ones.
    return uniformityCoefficient * uniformityCoefficient + 2.0 * densityCoefficient;
  }

  private double getCrosswordUniformityCoefficient(Crossword crossword) {
    long numRows =
        crossword.questions().stream()
            .map(Question::orientation)
            .filter(orientation -> orientation == Orientation.HORIZONTAL)
            .count();
    long numColumns =
        crossword.questions().stream()
            .map(Question::orientation)
            .filter(orientation -> orientation == Orientation.VERTICAL)
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
}
