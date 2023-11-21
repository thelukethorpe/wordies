package io.wordies.crossword.repository;

import io.wordies.util.CollectionUtils;
import java.util.*;
import java.util.stream.Collectors;

public class InMemoryCrosswordRepository implements CrosswordRepository {
  private final Map<String, List<String>> wordToHintsMap;
  private final Map<CharacterIndexPair, Set<String>> characterIndexPairToWordsMap;

  public InMemoryCrosswordRepository(Map<String, List<String>> wordToHintsMap) {
    this(wordToHintsMap, new HashMap<>());
    for (String word : wordToHintsMap.keySet()) {
      for (int index = 0; index < word.length(); index++) {
        Character character = word.charAt(index);
        CharacterIndexPair characterIndexPair = new CharacterIndexPair(character, index);
        characterIndexPairToWordsMap.compute(
            characterIndexPair,
            (key, words) -> {
              if (words == null) {
                words = new HashSet<>();
              }
              words.add(word);
              return words;
            });
      }
    }
  }

  private InMemoryCrosswordRepository(
      Map<String, List<String>> wordToHintsMap,
      Map<CharacterIndexPair, Set<String>> characterIndexPairToWordsMap) {
    this.wordToHintsMap = wordToHintsMap;
    this.characterIndexPairToWordsMap = characterIndexPairToWordsMap;
  }

  @Override
  public List<String> getWords(
      List<CharacterIndexPair> queries, int minWordLength, int maxWordLength) {
    return queries.stream()
        .map(characterIndexPairToWordsMap::get)
        .filter(Objects::nonNull)
        .reduce(wordToHintsMap.keySet(), CollectionUtils::intersection)
        .stream()
        .filter(word -> minWordLength <= word.length() && word.length() <= maxWordLength)
        .collect(Collectors.toList());
  }

  @Override
  public List<String> getHints(String word) {
    return wordToHintsMap.get(word);
  }
}
