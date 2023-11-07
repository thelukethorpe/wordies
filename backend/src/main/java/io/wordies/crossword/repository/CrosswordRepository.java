package io.wordies.crossword.repository;

import io.wordies.crossword.model.HintFactory;
import io.wordies.crossword.model.WordFactory;

public interface CrosswordRepository extends WordFactory, HintFactory {}
