package io.wordies.util;

import java.util.stream.Collectors;
import java.util.stream.Stream;

public class ErrorUtils {
  public static String toErrorMessage(Exception exception) {
    return exception.getMessage()
        + ":\n"
        + Stream.of(exception.getStackTrace())
            .map(Object::toString)
            .collect(Collectors.joining("\n"));
  }
}
