package io.wordies.crossword.model;

import java.util.List;

public record Question(
    Position position, Orientation orientation, List<String> hints, String answer) {}
