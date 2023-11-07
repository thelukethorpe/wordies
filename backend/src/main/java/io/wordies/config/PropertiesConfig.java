package io.wordies.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource("classpath:application.properties")
public class PropertiesConfig {

  @Value("${crossword.parameters.width.min}")
  private Integer crosswordParametersWidthMin;

  @Value("${crossword.parameters.width.max}")
  private Integer crosswordParametersWidthMax;

  @Value("${crossword.parameters.height.min}")
  private Integer crosswordParametersHeightMin;

  @Value("${crossword.parameters.height.max}")
  private Integer crosswordParametersHeightMax;

  @Value("${crossword.parameters.word.length.min}")
  private Integer crosswordParametersWordLengthMin;

  @Value("${crossword.parameters.word.length.max}")
  private Integer crosswordParametersWordLengthMax;

  @Value("${crossword.repository.path}")
  private String crosswordRepositoryPath;

  @Value("${crossword.quality.assurance.sample.size}")
  private int crosswordQualityAssuranceSampleSize;

  @Value("${frontend.url}")
  private String frontendUrl;

  public Integer getCrosswordParametersWidthMin() {
    return crosswordParametersWidthMin;
  }

  public Integer getCrosswordParametersWidthMax() {
    return crosswordParametersWidthMax;
  }

  public Integer getCrosswordParametersHeightMin() {
    return crosswordParametersHeightMin;
  }

  public Integer getCrosswordParametersHeightMax() {
    return crosswordParametersHeightMax;
  }

  public Integer getCrosswordParametersWordLengthMin() {
    return crosswordParametersWordLengthMin;
  }

  public Integer getCrosswordParametersWordLengthMax() {
    return crosswordParametersWordLengthMax;
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
