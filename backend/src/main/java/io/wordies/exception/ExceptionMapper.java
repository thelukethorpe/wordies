package io.wordies.exception;

import static org.apache.logging.log4j.Level.ERROR;

import io.wordies.util.ErrorUtils;
import java.util.List;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.ServletRequestBindingException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
@Order(value = Ordered.HIGHEST_PRECEDENCE)
public class ExceptionMapper {
  private static final Logger LOGGER = LogManager.getLogger(ExceptionMapper.class);

  @ExceptionHandler
  public ResponseEntity<ErrorDto> handleException(Exception exception) {
    LOGGER.log(ERROR, ErrorUtils.toErrorMessage(exception));
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(new ErrorDto(List.of("The server failed to process your request.")));
  }

  @ExceptionHandler
  public ResponseEntity<ErrorDto> handleException(
      ValidationErrorException validationErrorException) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(new ErrorDto(validationErrorException.getErrors()));
  }

  @ExceptionHandler
  public ResponseEntity<ErrorDto> handleException(
      ServletRequestBindingException servletRequestBindingException) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(new ErrorDto(List.of(servletRequestBindingException.getMessage())));
  }
}
