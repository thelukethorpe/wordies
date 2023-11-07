package io.wordies.crossword.model;

import java.util.List;

@FunctionalInterface
public interface WordFactory {

  List<String> getWords(List<CharacterIndexPair> queries, int minWordLength, int maxWordLength);

  record CharacterIndexPair(Character character, int index) {}
}
