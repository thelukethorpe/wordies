package io.wordies.util;

public class Mutable<T> {
  private T value;

  public Mutable() {
    this(null);
  }

  public Mutable(T value) {
    this.value = value;
  }

  public T getValue() {
    return value;
  }

  public void setValue(T value) {
    this.value = value;
  }
}
