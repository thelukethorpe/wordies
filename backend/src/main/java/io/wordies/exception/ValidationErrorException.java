package io.wordies.exception;

import java.util.List;

public class ValidationErrorException extends RuntimeException {

  private final List<String> errors;

  public ValidationErrorException(List<String> errors) {
    this.errors = errors;
  }

  public List<String> getErrors() {
    return errors;
  }
}
