export class ExponentialDistribution {
  constructor(mean) {
    this.mean = mean;
  }

  sample() {
    const percentile = Math.random();
    return -this.mean * Math.log(1 - percentile);
  }
}
