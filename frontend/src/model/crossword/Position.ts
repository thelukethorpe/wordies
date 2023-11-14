import { Orientation } from "./Orientation";
import { IsMappable } from "../../utils/structure/WordiesMap";

export class Position implements IsMappable {
  private readonly _x: number;
  private readonly _y: number;
  constructor(x, y) {
    this._x = x;
    this._y = y;
  }

  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._y;
  }

  translate(distance, orientation) {
    if (orientation === Orientation.Across) {
      return new Position(this._x + distance, this._y);
    }
    return new Position(this._x, this._y + distance);
  }

  get getUniqueKey(): string {
    return this._x + "," + this._y;
  }
}
