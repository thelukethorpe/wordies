package io.wordies.crossword.model.crossword;

import io.wordies.crossword.model.HintFactory;
import io.wordies.crossword.model.WordFactory;
import java.util.Random;

public abstract class CrosswordPainter {
  protected int minWordLength = 1, maxWordLength = 1;

  public abstract void paintCrossword(
      RandomCrosswordBuilder randomCrosswordBuilder,
      Random random,
      WordFactory wordFactory,
      HintFactory hintFactory);

  public void setMinWordLength(int minWordLength) {
    this.minWordLength = minWordLength;
  }

  public void setMaxWordLength(int maxWordLength) {
    this.maxWordLength = maxWordLength;
  }
}
