package io.wordies.crossword.model;

public enum Orientation {
  HORIZONTAL,
  VERTICAL;

  public Orientation flip() {
    if (this == VERTICAL) {
      return HORIZONTAL;
    }
    return VERTICAL;
  }
}
