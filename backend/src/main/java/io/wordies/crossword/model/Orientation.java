package io.wordies.crossword.model;

public enum Orientation {
  ACROSS,
  DOWN;

  public Orientation flip() {
    if (this == DOWN) {
      return ACROSS;
    }
    return DOWN;
  }
}
