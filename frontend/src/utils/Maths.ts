export class ExponentialDistribution {
  private readonly mean: number;

  constructor(mean) {
    this.mean = mean;
  }

  public sample(): number {
    const percentile = Math.random();
    return -this.mean * Math.log(1 - percentile);
  }
}

export namespace Random {
  export function randomInteger(exclusiveUpperBound: number): number {
    return Math.floor(Math.random() * exclusiveUpperBound);
  }
}
