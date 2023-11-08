package io.wordies.util;

public class MathUtils {
  public static int clamp(int value, int min, int max) {
    return Math.min(Math.max(value, min), max);
  }
}
