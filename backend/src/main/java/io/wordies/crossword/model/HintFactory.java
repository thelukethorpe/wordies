package io.wordies.crossword.model;

import java.util.List;

@FunctionalInterface
public interface HintFactory {
  List<String> getHints(String word);
}
