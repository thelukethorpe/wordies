package io.wordies.crossword.model.crossword;

import io.wordies.crossword.model.HintFactory;
import io.wordies.crossword.model.WordFactory;
import java.util.Random;

public abstract class CrosswordFactory {
  protected int width, height, minWordLength = 1, maxWordLength = 1, maxOffset = 1;

  public abstract Crossword getRandomCrossword(
      Random random, WordFactory wordFactory, HintFactory hintFactory);

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
