import React, { useEffect, useState } from "react";
import "./Page.css";
import { ExponentialDistribution } from "../utils/Maths";
import { useForceUpdate } from "../utils/Hooks";
import HomeTitle from "../components/home/HomeTitle";
import HomeCrosswordPortal from "../components/home/HomeCrosswordPortal";

export default function HomePage() {
  const forceUpdate = useForceUpdate();
  const homePageTitle = "wordies";
  const [isFlipped] = useState([]);

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

    for (let index = 0; index < homePageTitle.length; index++) {
      isFlipped[index] = false;
      const firstFlip = flipIntervalDistribution.sample();
      setTimeout(() => {
        flip(index);
      }, firstFlip);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="Page">
      <HomeTitle title={homePageTitle} isFlipped={isFlipped} style={{ padding: 50 }} />
      <HomeCrosswordPortal />
    </div>
  );
}
