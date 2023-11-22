import React, { useEffect, useState } from "react";
import "./Page.css";
import { useTheme } from "../theme";
import { Tile } from "../components/common/Tile";
import Flippable from "../components/common/Flippable";
import { ExponentialDistribution } from "../utils/Maths";
import { useForceUpdate } from "../utils/Hooks";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Path } from "../constants/Path";
import CrosswordHintCard from "../components/crossword/CrosswordHintCard";

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
      raised={true}
    />
  );
  const back = <Tile character={props.character} index={props.index} size={size} raised={true} />;
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

function CrosswordPortal() {
  const navigate = useNavigate();
  const theme = useTheme();
  const portalTitle = "crosswords";
  const tileIndices = [1];
  const tilePadding = 2;
  const tileSize = 50;
  return (
    <Card style={{ backgroundColor: theme.accentColor, padding: 5 }} raised={true}>
      <CardContent
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            paddingBottom: 15
          }}>
          {Array.from({ length: portalTitle.length }).map((_, index) => (
            <div
              key={index}
              style={{
                padding: tilePadding
              }}>
              <Tile character={portalTitle[index]} index={tileIndices[index]} size={tileSize} />
            </div>
          ))}
        </div>
        <div>
          <CrosswordHintCard
            title="Across"
            hints={[
              {
                index: 1,
                text: "A classic word-deduction game with AI-generated clues.",
                length: 10
              }
            ]}
            style={{ titleFontSize: 20, width: "15.5em", height: "2em" }}
            verticalPadding={5}
          />
          <Button
            variant="contained"
            style={{ backgroundColor: theme.successColor, width: "100%" }}
            onClick={() => {
              navigate(Path.Crossword);
            }}>
            Play
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

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
      <HomePageTitle title={homePageTitle} isFlipped={isFlipped} style={{ padding: 50 }} />
      <CrosswordPortal />
    </div>
  );
}
