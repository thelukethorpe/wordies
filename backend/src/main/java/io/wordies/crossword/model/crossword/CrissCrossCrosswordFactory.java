package io.wordies.crossword.model.crossword;

import io.wordies.crossword.model.HintFactory;
import io.wordies.crossword.model.Orientation;
import io.wordies.crossword.model.Position;
import io.wordies.crossword.model.WordFactory;
import java.util.Random;
import java.util.function.Function;

public class CrissCrossCrosswordFactory extends CrosswordFactory {

  @Override
  public Crossword getRandomCrossword(
      Random random, WordFactory wordFactory, HintFactory hintFactory) {
    Orientation orientation = random.nextBoolean() ? Orientation.HORIZONTAL : Orientation.VERTICAL;
    RandomCrosswordBuilder builder = new RandomCrosswordBuilder(width, height);
    addRandomWords(builder, orientation, random, wordFactory, hintFactory);
    addRandomWords(builder, orientation.flip(), random, wordFactory, hintFactory);
    return builder.build();
  }

  private void addRandomWords(
      RandomCrosswordBuilder builder,
      Orientation orientation,
      Random random,
      WordFactory wordFactory,
      HintFactory hintFactory) {
    // If orientation is VERTICAL,   then u = x and v = y.
    // If orientation is HORIZONTAL, then u = y and v = x.
    Function<Position, Position> changeDomain =
        position ->
            new Position(
                position.getComponent(orientation.flip()), position.getComponent(orientation));
    Position xyDimensions = new Position(width, height);
    Position uvDimensions = changeDomain.apply(xyDimensions);

    for (int u = 0; u < uvDimensions.x(); u++) {
      int v = Math.min(u, getRandomOffset(random));
      while (v < uvDimensions.y()) {
        Position uvPosition = new Position(u, v);
        Position xyPosition = changeDomain.apply(uvPosition);
        int delta =
            builder.addRandomWord(
                xyPosition,
                orientation,
                minWordLength,
                maxWordLength,
                random,
                wordFactory,
                hintFactory);
        if (delta > 0) {
          v += delta + getRandomOffset(random) + 1;
        } else {
          v++;
        }
      }
    }
  }

  private int getRandomOffset(Random random) {
    return random.nextInt(maxOffset + 1);
  }
}
