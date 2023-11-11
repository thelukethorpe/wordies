package io.wordies.crossword.model.crossword;

import io.wordies.crossword.model.*;
import java.util.*;

public class RandomCrosswordBuilder {
  private final int width;
  private final int height;
  private final Map<Position, Character> positionToCharacterMap = new HashMap<>();
  private final Map<String, Question> questions = new HashMap<>();

  public RandomCrosswordBuilder(int width, int height) {
    this.width = width;
    this.height = height;
  }

  public Crossword build() {
    return new Crossword(width, height, new ArrayList<>(questions.values()));
  }

  int getWidth() {
    return width;
  }

  int getHeight() {
    return height;
  }

  int addRandomWord(
      Position position,
      Orientation orientation,
      int minWordLength,
      int maxWordLength,
      Random random,
      WordFactory wordFactory,
      HintFactory hintFactory) {
    // TODO abstract these to functions
    if (positionToCharacterMap.containsKey(position.translate(-1, orientation))) {
      return 0;
    }

    {
      Position maxPosition = position.translate(maxWordLength, orientation);
      int maxEdgeDelta = Math.max(maxPosition.x() - width, maxPosition.y() - height);
      if (maxEdgeDelta > 0) {
        maxWordLength -= maxEdgeDelta;
      }
    }

    while (positionToCharacterMap.containsKey(position.translate(maxWordLength, orientation))) {
      maxWordLength--;
    }

    for (int index = 0; index < maxWordLength; index++) {
      Position queryPosition = position.translate(index, orientation);
      if (positionToCharacterMap.containsKey(queryPosition)) {
        continue;
      } else if (positionToCharacterMap.containsKey(queryPosition.translate(1, orientation.flip()))
          || positionToCharacterMap.containsKey(queryPosition.translate(-1, orientation.flip()))) {
        maxWordLength = index;
        break;
      }
    }

    if (minWordLength > maxWordLength) {
      return 0;
    }

    List<WordFactory.CharacterIndexPair> queries = new ArrayList<>(maxWordLength);
    Set<String> words = new HashSet<>();
    words.add("");
    for (int index = 0; index < maxWordLength; index++) {
      Position queryPosition = position.translate(index, orientation);
      Character character = positionToCharacterMap.get(queryPosition);
      if (character != null) {
        if (index - 1 >= minWordLength) {
          // We set pass `index - 1` as the maximum word length here to ensure that even the longest
          // word does not join itself to an occupied tile.
          words.addAll(wordFactory.getWords(queries, minWordLength, index - 1));
        }
        queries.add(new WordFactory.CharacterIndexPair(character, index));
        minWordLength = index + 1;
      }
    }

    words.addAll(wordFactory.getWords(queries, minWordLength, maxWordLength));
    questions.values().forEach(question -> words.remove(question.answer()));

    return words.stream()
        .skip(random.nextLong(words.size()))
        .filter(word -> !word.isBlank())
        .findFirst()
        .map(word -> addWord(position, orientation, word, hintFactory))
        .orElse(0);
  }

  private int addWord(
      Position position, Orientation orientation, String word, HintFactory hintFactory) {
    for (int index = 0; index < word.length(); index++) {
      positionToCharacterMap.put(position.translate(index, orientation), word.charAt(index));
    }
    List<String> hints = hintFactory.getHints(word);
    questions.put(word, new Question(position, orientation, hints, word));
    cullSmallerSubstrings(word);
    return word.length();
  }

  private void cullSmallerSubstrings(String word) {
    questions.keySet().stream()
        .filter(key -> key.contains(word) || word.contains(key))
        .sorted((s1, s2) -> Comparator.comparingInt(String::length).reversed().compare(s1, s2))
        .skip(1)
        .forEach(questions::remove);
  }
}
