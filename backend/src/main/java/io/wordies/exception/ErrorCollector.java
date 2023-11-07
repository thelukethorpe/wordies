package io.wordies.exception;

import java.util.LinkedList;
import java.util.List;

public class ErrorCollector {
  private final List<String> errors = new LinkedList<>();

  public void addError(String error, Object... objects) {
    errors.add(String.format(error, objects));
  }

  public boolean hasErrors() {
    return !errors.isEmpty();
  }

  public List<String> getErrors() {
    return errors;
  }
}
