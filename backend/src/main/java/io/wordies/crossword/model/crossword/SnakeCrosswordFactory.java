package io.wordies.crossword.model.crossword;

import io.wordies.crossword.model.HintFactory;
import io.wordies.crossword.model.Orientation;
import io.wordies.crossword.model.Position;
import io.wordies.crossword.model.WordFactory;
import io.wordies.util.MathUtils;
import java.util.Random;

public class SnakeCrosswordFactory extends CrosswordFactory {
  @Override
  public Crossword getRandomCrossword(
      Random random, WordFactory wordFactory, HintFactory hintFactory) {
    Orientation orientation = random.nextBoolean() ? Orientation.HORIZONTAL : Orientation.VERTICAL;
    RandomCrosswordBuilder builder = new RandomCrosswordBuilder(width, height);
    addRandomWordSnakes(builder, orientation, random, wordFactory, hintFactory);
    addRandomWordSnakes(builder, orientation.flip(), random, wordFactory, hintFactory);
    return builder.build();
  }

  private void addRandomWordSnakes(
      RandomCrosswordBuilder builder,
      Orientation orientation,
      Random random,
      WordFactory wordFactory,
      HintFactory hintFactory) {
    // If orientation is HORIZONTAL, then u = x and v = y.
    // If orientation is VERTICAL,   then u = y and v = x.
    Position xyDimensions = new Position(width, height);
    Position uvDimensions =
        new Position(
            xyDimensions.getComponent(orientation), xyDimensions.getComponent(orientation.flip()));
    Position origin = new Position(0, 0);
    for (int u = 0; u < uvDimensions.x(); u++) {
      Position position = origin.translate(u, orientation);
      addRandomWordSnake(builder, position, orientation.flip(), random, wordFactory, hintFactory);
      position = position.translate(uvDimensions.y() / 2, orientation.flip());
      addRandomWordSnake(builder, position, orientation.flip(), random, wordFactory, hintFactory);
    }
  }

  private void addRandomWordSnake(
      RandomCrosswordBuilder builder,
      Position position,
      Orientation orientation,
      Random random,
      WordFactory wordFactory,
      HintFactory hintFactory) {
    int delta;
    while ((delta =
            builder.addRandomWord(
                position,
                orientation,
                minWordLength,
                maxWordLength,
                random,
                wordFactory,
                hintFactory))
        > 0) {
      {
        int next = random.nextInt(delta + 1);
        position = position.translate(next, orientation);
      }
      orientation = orientation.flip();
      {
        int next = random.nextInt(minWordLength + 1);
        position = position.translate(-next, orientation);
      }
      position = clampToBounds(position);
    }
  }

  private Position clampToBounds(Position position) {
    int x = MathUtils.clamp(position.x(), 0, width - 1);
    int y = MathUtils.clamp(position.y(), 0, height - 1);
    return new Position(x, y);
  }
}
