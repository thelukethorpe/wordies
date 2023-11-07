package io.wordies.crossword;

import io.wordies.config.PropertiesConfig;
import io.wordies.exception.ErrorCollector;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CrosswordValidator {
  private final int minWidth;
  private final int maxWidth;
  private final int minHeight;
  private final int maxHeight;
  private final int minWordLength;
  private final int maxWordLength;

  @Autowired
  public CrosswordValidator(PropertiesConfig propertiesConfig) {
    this.minWidth = propertiesConfig.getCrosswordParametersWidthMin();
    this.maxWidth = propertiesConfig.getCrosswordParametersWidthMax();
    this.minHeight = propertiesConfig.getCrosswordParametersHeightMin();
    this.maxHeight = propertiesConfig.getCrosswordParametersHeightMax();
    this.minWordLength = propertiesConfig.getCrosswordParametersWordLengthMin();
    this.maxWordLength = propertiesConfig.getCrosswordParametersWordLengthMax();
  }

  public ErrorCollector onGet(int width, int height, int minWordLength, int maxWordLength) {
    ErrorCollector errorCollector = new ErrorCollector();
    if (width < minWidth) {
      errorCollector.addError("Width is %d, but it must be at least than %d.", width, minWidth);
    } else if (width > maxWidth) {
      errorCollector.addError("Width is %d, but it must be at most %d.", width, maxWidth);
    }
    if (height < minHeight) {
      errorCollector.addError("Height is %d, but it must be at least %d.", height, minHeight);
    } else if (height > maxHeight) {
      errorCollector.addError("Height is %d, but it must be at most %d.", height, maxHeight);
    }
    if (minWordLength < this.minWordLength) {
      errorCollector.addError(
          "Minimum word length is %d, but it must be at least %d.",
          minWordLength, this.minWordLength);
    }
    if (maxWordLength > this.maxWordLength) {
      errorCollector.addError(
          "Maximum word length is %d, but it must be at most %d.",
          maxWordLength, this.maxWordLength);
    }
    if (minWordLength > width) {
      errorCollector.addError(
          "Minimum word length is %d, but it must be at most equal to the width, which is %d.",
          minWordLength, width);
    }
    if (minWordLength > height) {
      errorCollector.addError(
          "Minimum word length is %d, but it must be at most equal to the height, which is %d.",
          minWordLength, height);
    }
    return errorCollector;
  }
}
