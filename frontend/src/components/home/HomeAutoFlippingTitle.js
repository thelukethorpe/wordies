import React, { useEffect, useState } from "react";
import { useForceUpdate } from "../../utils/Hooks";
import { ExponentialDistribution } from "../../utils/Maths";
import HomeTitle from "./HomeTitle";

export default function AutoFlippingHomeTitle(props) {
  const forceUpdate = useForceUpdate();
  const [isFlipped] = useState([]);
  const { style, title } = props;

  useEffect(() => {
    const flipIntervalDistribution = new ExponentialDistribution(10000.0);
    const flip = (index) => {
      isFlipped[index] = !isFlipped[index];
      forceUpdate();
      const nextFlip = flipIntervalDistribution.sample() + 10000.0;
      setTimeout(() => {
        flip(index);
      }, nextFlip);
    };

    for (let index = 0; index < title.length; index++) {
      isFlipped[index] = false;
      const firstFlip = flipIntervalDistribution.sample();
      setTimeout(() => {
        flip(index);
      }, firstFlip);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <HomeTitle title={props.title} isFlipped={isFlipped} style={style} />;
}
