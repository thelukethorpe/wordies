export enum Orientation {
  Across,
  Down
}

export namespace OrientationUtils {
  export function random(): Orientation {
    return Math.random() < 0.5 ? Orientation.Across : Orientation.Down;
  }

  export function fromString(string: string): Orientation {
    if (string.toLowerCase() === "across") {
      return Orientation.Across;
    } else if (string.toLowerCase() === "down") {
      return Orientation.Down;
    }
    return null;
  }
}
