package io.wordies.crossword.model.crossword;

import io.wordies.crossword.model.Question;
import java.util.List;

public record Crossword(int width, int height, List<Question> questions) {}
