import { Position } from "./Position";
import { Orientation } from "./Orientation";
import { WordiesMap } from "../../utils/structure/WordiesMap";

class CrosswordTileView {
  private readonly _isInPlay: boolean;
  private readonly _index: number;
  private readonly _guess: string;
  private readonly _hasBeenGuessedCorrectly: boolean;
  private readonly _isSelected: boolean = false;

  constructor(
    isInPlay: boolean,
    index: number,
    guess: string,
    hasBeenGuessedCorrectly: boolean,
    isSelected: boolean
  ) {
    this._isInPlay = isInPlay;
    this._index = index;
    this._guess = guess;
    this._hasBeenGuessedCorrectly = hasBeenGuessedCorrectly;
    this._isSelected = isSelected;
  }

  get isInPlay(): boolean {
    return this._isInPlay;
  }

  get index(): number {
    return this._index;
  }

  get guess(): string {
    return this._guess;
  }

  get hasBeenGuessedCorrectly(): boolean {
    return this._hasBeenGuessedCorrectly;
  }

  get isSelected(): boolean {
    return this._isSelected;
  }
}

class CrosswordTile {
  private readonly _index: number;
  private _guess = "";
  private _hasBeenGuessedCorrectly = false;
  private _isSelected = false;

  constructor(index: number) {
    this._index = index;
  }

  public view(): CrosswordTileView {
    return new CrosswordTileView(
      /* isInPlay */ true,
      this._index,
      this._guess,
      this._hasBeenGuessedCorrectly,
      this._isSelected
    );
  }

  set guess(value: string) {
    this._guess = value;
  }

  public markAsGuessedCorrectly(): void {
    this._hasBeenGuessedCorrectly = true;
  }

  set isSelected(value: boolean) {
    this._isSelected = value;
  }
}

class CrosswordHint {
  private readonly _index: number;
  private readonly _text: string;
  private readonly _length: number;
  private _hasBeenGuessedCorrectly = false;

  constructor(index: number, text: string, length: number) {
    this._index = index;
    this._text = text;
    this._length = length;
  }

  get index(): number {
    return this._index;
  }

  get text(): string {
    return this._text;
  }

  get length(): number {
    return this._length;
  }

  get hasBeenGuessedCorrectly(): boolean {
    return this._hasBeenGuessedCorrectly;
  }

  public markAsGuessedCorrectly(): void {
    this._hasBeenGuessedCorrectly = true;
  }
}

class CrosswordAnswer {
  private readonly _position: Position;
  private readonly _orientation: Orientation;
  private readonly _text: string;

  constructor(position: Position, orientation: Orientation, text: string) {
    this._position = position;
    this._orientation = orientation;
    this._text = text;
  }

  get position(): Position {
    return this._position;
  }

  get orientation(): Orientation {
    return this._orientation;
  }

  get text(): string {
    return this._text;
  }
}

class Crossword {
  private readonly _width: number;
  private readonly _height: number;
  private readonly _inPlayPositionToHintIndexMap: WordiesMap<Position, number>;
  private readonly _orientationToHintsMap: Map<Orientation, Array<CrosswordHint>>;
  private readonly _answerIndexToHintMap: Map<number, CrosswordHint>;
  private readonly _answerIndexToAnswerMap: Map<number, CrosswordAnswer>;

  constructor(
    width: number,
    height: number,
    inPlayPositionToHintIndexMap: WordiesMap<Position, number>,
    orientationToHintsMap: Map<Orientation, Array<CrosswordHint>>,
    answerIndexToHintMap: Map<number, CrosswordHint>,
    answerIndexToAnswerMap: Map<number, CrosswordAnswer>
  ) {
    this._width = width;
    this._height = height;
    this._inPlayPositionToHintIndexMap = inPlayPositionToHintIndexMap;
    this._orientationToHintsMap = orientationToHintsMap;
    this._answerIndexToHintMap = answerIndexToHintMap;
    this._answerIndexToAnswerMap = answerIndexToAnswerMap;
  }

  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }

  get answerIndices(): Set<number> {
    return new Set(this._answerIndexToAnswerMap.keys());
  }

  get inPlayPositionToHintIndexPairs(): [Position, number][] {
    return Array.from(this._inPlayPositionToHintIndexMap.entries());
  }

  public getHints(orientation: Orientation): Array<CrosswordHint> {
    return this._orientationToHintsMap.get(orientation);
  }

  public getHint(answerIndex: number): CrosswordHint {
    return this._answerIndexToHintMap.get(answerIndex);
  }

  public getAnswer(answerIndex: number): CrosswordAnswer {
    return this._answerIndexToAnswerMap.get(answerIndex);
  }
}

export class CrosswordBuilder {
  private readonly width: number;
  private readonly height: number;
  private readonly _inPlayPositionToHintIndexMap: WordiesMap<Position, number>;
  private readonly _orientationToHintsMap: Map<Orientation, Array<CrosswordHint>>;
  private readonly _answerIndexToHintMap: Map<number, CrosswordHint>;
  private readonly _answerIndexToAnswerMap: Map<number, CrosswordAnswer>;
  private nextAnswerIndex = 0;
  private nextHintIndex = 1;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this._inPlayPositionToHintIndexMap = new WordiesMap();
    this._orientationToHintsMap = new Map(
      Object.keys(Orientation).map((key) => [Orientation[key], []])
    );
    this._answerIndexToHintMap = new Map();
    this._answerIndexToAnswerMap = new Map();
  }

  public build(): Crossword {
    return new Crossword(
      this.width,
      this.height,
      this._inPlayPositionToHintIndexMap,
      this._orientationToHintsMap,
      this._answerIndexToHintMap,
      this._answerIndexToAnswerMap
    );
  }

  public addHintAndAnswer(
    position: Position,
    orientation: Orientation,
    hintText: string,
    answerText: string
  ): void {
    let hintIndex = this._inPlayPositionToHintIndexMap.get(position);
    if (!hintIndex) {
      hintIndex = this.nextHintIndex++;
      this._inPlayPositionToHintIndexMap.set(position, hintIndex);
    }
    const hint = new CrosswordHint(hintIndex, hintText, answerText.length);
    this._orientationToHintsMap.get(orientation).push(hint);
    const answerIndex = this.nextAnswerIndex++;
    this._answerIndexToHintMap.set(answerIndex, hint);
    this._answerIndexToAnswerMap.set(
      answerIndex,
      new CrosswordAnswer(position, orientation, answerText)
    );
    for (let i = 1; i < answerText.length; i++) {
      const nextPosition = position.translate(i, orientation);
      this._inPlayPositionToHintIndexMap.set(nextPosition, null);
    }
  }
}

class CrosswordView {
  private readonly _width: number;
  private readonly _height: number;
  private readonly _tiles: WordiesMap<Position, CrosswordTile>;

  constructor(width: number, height: number, tiles: WordiesMap<Position, CrosswordTile>) {
    this._width = width;
    this._height = height;
    this._tiles = tiles;
  }

  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }

  public getTile(position: Position): CrosswordTileView {
    const tile = this._tiles.get(position);
    if (tile) {
      return tile.view();
    }
    return new CrosswordTileView(/* isInPlay */ false, null, null, false, false);
  }
}

export class CrosswordGameController {
  private readonly _crossword: Crossword;
  private readonly _tiles: WordiesMap<Position, CrosswordTile>;
  private readonly _remainingAnswerIndices: Set<number>;
  private _selectedPosition: Position;
  private _selectedOrientation: Orientation;

  constructor(crossword: Crossword) {
    this._crossword = crossword;
    this._tiles = new WordiesMap<Position, CrosswordTile>(
      crossword.inPlayPositionToHintIndexPairs
        .map(([position, hintIndex]): [Position, CrosswordTile] => {
          return [position, new CrosswordTile(hintIndex)];
        })
        .values()
    );
    this._remainingAnswerIndices = crossword.answerIndices;
  }

  get crossword(): CrosswordView {
    return new CrosswordView(this._crossword.width, this._crossword.height, this._tiles);
  }

  public getHints(orientation: Orientation): Array<CrosswordHint> {
    return this._crossword.getHints(orientation);
  }

  public select(position: Position, orientation: Orientation): void {
    if (this._selectedPosition) {
      this._tiles.get(this._selectedPosition).isSelected = false;
    }
    this._tiles.get(position).isSelected = true;
    this._selectedPosition = position;
    this._selectedOrientation = orientation;
  }

  public nextSelection(orientation: Orientation): Position {
    let nextSelection = this._selectedPosition.translate(1, orientation);
    while (this._tiles.has(nextSelection)) {
      const tile = this._tiles.get(nextSelection).view();
      if (!tile.hasBeenGuessedCorrectly) {
        return nextSelection;
      }
      nextSelection = nextSelection.translate(1, this._selectedOrientation);
    }
    return null;
  }

  public makeGuess(guess: string): void {
    const tile = this._tiles.get(this._selectedPosition);
    if (!tile) {
      return;
    }
    tile.guess = guess;
    tile.isSelected = false;
    this._selectedPosition = this.nextSelection(this._selectedOrientation);
    if (this._selectedPosition) {
      this._tiles.get(this._selectedPosition).isSelected = true;
    }
  }

  private isGuessCorrect(answerIndex: number): boolean {
    const answer = this._crossword.getAnswer(answerIndex);
    const tiles: Array<CrosswordTile> = [];
    for (let i = 0; i < answer.text.length; i++) {
      const position = answer.position.translate(i, answer.orientation);
      const tile = this._tiles.get(position);
      if (tile.view().guess !== answer.text[i]) {
        return false;
      }
      tiles.push(tile);
    }
    tiles.forEach((tile) => tile.markAsGuessedCorrectly());
    return true;
  }

  public checkGuesses(): boolean {
    for (const answerIndex of this._remainingAnswerIndices) {
      if (this.isGuessCorrect(answerIndex)) {
        this._remainingAnswerIndices.delete(answerIndex);
        this._crossword.getHint(answerIndex).markAsGuessedCorrectly();
      }
    }
    return this._remainingAnswerIndices.size === 0;
  }
}
