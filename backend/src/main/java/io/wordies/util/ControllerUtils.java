package io.wordies.util;

import io.wordies.exception.ErrorCollector;
import io.wordies.exception.ValidationErrorException;

public class ControllerUtils {
  public static final String API_PREFIX_V1 = "api/v1/";

  public static void validate(ErrorCollector errorCollector) {
    if (errorCollector.hasErrors()) {
      throw new ValidationErrorException(errorCollector.getErrors());
    }
  }
}
