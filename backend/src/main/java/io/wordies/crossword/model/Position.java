package io.wordies.crossword.model;

public record Position(int x, int y) {

  public int getComponent(Orientation orientation) {
    if (orientation == Orientation.ACROSS) {
      return x;
    }
    return y;
  }

  public Position translate(int distance, Orientation orientation) {
    if (orientation == Orientation.ACROSS) {
      return new Position(x + distance, y);
    }
    return new Position(x, y + distance);
  }
}
