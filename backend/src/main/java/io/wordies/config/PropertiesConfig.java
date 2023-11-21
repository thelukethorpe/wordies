package io.wordies.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource("classpath:application.properties")
public class PropertiesConfig {

  @Value("${crossword.backlog.size}")
  private Integer crosswordBacklogSize;

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

  @Value("${crossword.quality.assurance.acceptable.percentile}")
  private Double crosswordQualityAssuranceAcceptablePercentile;

  @Value("${crossword.quality.assurance.sample.size}")
  private Integer crosswordQualityAssuranceSampleSize;

  @Value("${crossword.workers}")
  private Integer crosswordWorkers;

  @Value("${executor.threads}")
  private Integer executorThreads;

  @Value("${frontend.url}")
  private String frontendUrl;

  public Integer getCrosswordBacklogSize() {
    return crosswordBacklogSize;
  }

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

  public Double getCrosswordQualityAssuranceAcceptablePercentile() {
    return crosswordQualityAssuranceAcceptablePercentile;
  }

  public Integer getCrosswordQualityAssuranceSampleSize() {
    return crosswordQualityAssuranceSampleSize;
  }

  public Integer getCrosswordWorkers() {
    return crosswordWorkers;
  }

  public Integer getExecutorThreads() {
    return executorThreads;
  }

  public String getFrontendUrl() {
    return frontendUrl;
  }
}
