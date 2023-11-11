package io.wordies.util.concurrent;

import java.util.function.UnaryOperator;

public class Atomic<T> {
  private T value;

  public Atomic() {
    this(null);
  }

  public Atomic(T value) {
    this.value = value;
  }

  public synchronized T getValue() {
    return value;
  }

  public synchronized void setValue(T value) {
    this.value = value;
  }

  public synchronized void update(UnaryOperator<T> updater) {
    value = updater.apply(value);
  }
}
