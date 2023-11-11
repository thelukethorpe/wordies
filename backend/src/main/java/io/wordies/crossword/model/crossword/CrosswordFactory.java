package io.wordies.crossword.model.crossword;

import io.wordies.crossword.model.HintFactory;
import io.wordies.crossword.model.WordFactory;
import java.util.Random;

public class CrosswordFactory {
  private int width, height, minWordLength, maxWordLength, maxOffset;
  private final WordFactory wordFactory;
  private final HintFactory hintFactory;

  public CrosswordFactory(WordFactory wordFactory, HintFactory hintFactory) {
    this.wordFactory = wordFactory;
    this.hintFactory = hintFactory;
  }

  public Crossword getRandomCrossword(Random random) {
    SnakeCrosswordPainter snakeCrosswordPainter = new SnakeCrosswordPainter();
    snakeCrosswordPainter.setMinWordLength(minWordLength);
    snakeCrosswordPainter.setMaxWordLength(maxWordLength);
    CrissCrossCrosswordPainter crissCrossCrosswordPainter = new CrissCrossCrosswordPainter();
    crissCrossCrosswordPainter.setMinWordLength(minWordLength);
    crissCrossCrosswordPainter.setMaxWordLength(maxWordLength);
    crissCrossCrosswordPainter.setMaxOffset(maxOffset);
    RandomCrosswordBuilder builder = new RandomCrosswordBuilder(width, height);
    snakeCrosswordPainter.paintCrossword(builder, random, wordFactory, hintFactory);
    crissCrossCrosswordPainter.paintCrossword(builder, random, wordFactory, hintFactory);
    return builder.build();
  }

  public void setWidth(int width) {
    this.width = width;
  }

  public void setHeight(int height) {
    this.height = height;
  }

  public void setMinWordLength(int minWordLength) {
    this.minWordLength = minWordLength;
  }

  public void setMaxWordLength(int maxWordLength) {
    this.maxWordLength = maxWordLength;
  }

  public void setMaxOffset(int maxOffset) {
    this.maxOffset = maxOffset;
  }
}
