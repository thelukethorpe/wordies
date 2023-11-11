package io.wordies.crossword;

import static io.wordies.util.ControllerUtils.API_PREFIX_V1;

import io.wordies.crossword.model.crossword.Crossword;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(API_PREFIX_V1 + "crossword")
public class CrosswordController {

  private final CrosswordService crosswordService;

  @Autowired
  public CrosswordController(CrosswordService crosswordService) {
    this.crosswordService = crosswordService;
  }

  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<Crossword> get() {
    Crossword crossword = crosswordService.getRandomCrossword();
    return ResponseEntity.ok().body(crossword);
  }
}
