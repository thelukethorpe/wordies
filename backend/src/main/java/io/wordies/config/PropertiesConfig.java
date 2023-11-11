package io.wordies.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource("classpath:application.properties")
public class PropertiesConfig {

  @Value("${crossword.parameters.width}")
  private Integer crosswordParametersWidth;

  @Value("${crossword.parameters.height}")
  private Integer crosswordParametersHeight;

  @Value("${crossword.parameters.word.length.min}")
  private Integer crosswordParametersWordLengthMin;

  @Value("${crossword.parameters.word.length.max}")
  private Integer crosswordParametersWordLengthMax;

  @Value("${crossword.parameters.offset.max}")
  private Integer crosswordParametersOffsetMax;

  @Value("${crossword.repository.path}")
  private String crosswordRepositoryPath;

  @Value("${crossword.quality.assurance.sample.size}")
  private int crosswordQualityAssuranceSampleSize;

  @Value("${frontend.url}")
  private String frontendUrl;

  public Integer getCrosswordParametersWidth() {
    return crosswordParametersWidth;
  }

  public Integer getCrosswordParametersHeight() {
    return crosswordParametersHeight;
  }

  public Integer getCrosswordParametersWordLengthMin() {
    return crosswordParametersWordLengthMin;
  }

  public Integer getCrosswordParametersWordLengthMax() {
    return crosswordParametersWordLengthMax;
  }

  public Integer getCrosswordParametersOffsetMax() {
    return crosswordParametersOffsetMax;
  }

  public String getCrosswordRepositoryPath() {
    return crosswordRepositoryPath;
  }

  public int getCrosswordQualityAssuranceSampleSize() {
    return crosswordQualityAssuranceSampleSize;
  }

  public String getFrontendUrl() {
    return frontendUrl;
  }
}
