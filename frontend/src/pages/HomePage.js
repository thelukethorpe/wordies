import React, { useEffect, useState } from "react";
import "./Page.css";
import ClickableMediaCard from "../components/ClickableMediaCard";
import CrosswordImage from "../assets/images/crossword.jpg";
import Paths from "../constants/Paths";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../theme";
import { Tile } from "../components/Tile";
import Flippable from "../components/Flippable";
import { ExponentialDistribution } from "../utils/Maths";
import { useForceUpdate } from "../utils/Hooks";

function HomePageTitleTile(props) {
  const theme = useTheme();
  const padding = 5;
  const size = 100;
  const front = (
    <Tile
      character={props.character}
      size={size}
      style={{
        backgroundColor: theme.accentColor
      }}
    />
  );
  const back = <Tile character={props.character} index={props.index} size={size} />;
  return (
    <div style={{ padding: padding, width: size, height: size, marginTop: 0 }}>
      <Flippable front={front} back={back} isFlipped={props.isFlipped} />
    </div>
  );
}

function HomePageTitle(props) {
  return (
    <div
      style={{ ...props.style, display: "flex", flexDirection: "row", justifyContent: "center" }}>
      {Array.from({ length: props.title.length }).map((_, index) => (
        <HomePageTitleTile
          key={index}
          character={props.title[index]}
          index={index + 1}
          isFlipped={props.isFlipped[index]}
        />
      ))}
    </div>
  );
}

export default function HomePage() {
  const forceUpdate = useForceUpdate();
  const navigate = useNavigate();
  const homePageTitle = "wordies";
  const flipIntervalDistribution = new ExponentialDistribution(10000.0);
  const [isFlipped] = useState([]);

  const flip = (index) => {
    isFlipped[index] = !isFlipped[index];
    forceUpdate();
    const nextFlip = flipIntervalDistribution.sample() + 10000.0;
    setTimeout(() => {
      flip(index);
    }, nextFlip);
  };

  useEffect(() => {
    for (let index = 0; index < homePageTitle.length; index++) {
      isFlipped[index] = false;
      const firstFlip = flipIntervalDistribution.sample();
      setTimeout(() => {
        flip(index);
      }, firstFlip);
    }
  }, []);

  return (
    <div className="Page">
      <HomePageTitle title={homePageTitle} isFlipped={isFlipped} style={{ padding: 20 }} />
      <ClickableMediaCard
        title="Crosswords"
        description="Cross some words!"
        image={CrosswordImage}
        onClick={() => {
          return navigate(Paths.CROSSWORD);
        }}
        style={{ width: 345, border: 2, boxShadow: 10 }}
      />
    </div>
  );
}
