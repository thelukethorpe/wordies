package io.wordies.crossword;

import static io.wordies.util.ControllerUtils.API_PREFIX_V1;
import static io.wordies.util.ControllerUtils.validate;

import io.wordies.crossword.model.crossword.Crossword;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(API_PREFIX_V1 + "crossword")
public class CrosswordController {

  private final CrosswordValidator crosswordValidator;
  private final CrosswordService crosswordService;

  @Autowired
  public CrosswordController(
      CrosswordValidator crosswordValidator, CrosswordService crosswordService) {
    this.crosswordValidator = crosswordValidator;
    this.crosswordService = crosswordService;
  }

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<Crossword> get(
      @RequestParam int width,
      @RequestParam int height,
      @RequestParam int minWordLength,
      @RequestParam int maxWordLength) {
    validate(crosswordValidator.onGet(width, height, minWordLength, maxWordLength));
    Crossword crossword =
        crosswordService.getRandomCrossword(width, height, minWordLength, maxWordLength);
    return ResponseEntity.ok().body(crossword);
  }
}
