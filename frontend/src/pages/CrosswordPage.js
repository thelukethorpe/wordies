import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useTheme } from "../theme";
import { useEffect, useMemo, useState } from "react";
import Flippable from "../components/Flippable";
import Api from "../constants/Api";
import { CardActionArea, Dialog, DialogTitle, Divider } from "@mui/material";
import Keyboard from "../components/Keyboard";
import { useForceUpdate } from "../utils/Hooks";
import { Tile } from "../components/Tile";
import Keys from "../constants/Keys";
import Orientation from "../constants/Orientation";

function TileIntersectionDialog(props) {
  const theme = useTheme();
  const handleClose = () => {
    props.onClose(null);
  };

  const handleSelection = (orientation) => {
    props.onClose(orientation);
  };

  return (
    <Dialog onClose={handleClose} open={props.isOpen}>
      <DialogTitle sx={{ fontWeight: "bold" }}>Which direction?</DialogTitle>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 25,
          backgroundColor: theme.backgroundColor
        }}>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
          <CrosswordTile contents={{ guess: props.guess, answer: "?", index: props.index }} />
          <CrosswordTile
            contents={{
              guess: "→",
              answer: "?",
              isSelected: true,
              onClick: () => handleSelection(Orientation.ACROSS)
            }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
          <CrosswordTile
            contents={{
              guess: "↓",
              answer: "?",
              isSelected: true,
              onClick: () => handleSelection(Orientation.DOWN)
            }}
          />
          <CrosswordTile contents={{ answer: "" }} />
        </div>
      </div>
    </Dialog>
  );
}

function ListCard(props) {
  const titleFontSize = 30;
  return (
    <Card style={props.style}>
      <CardContent>
        <Typography style={{ fontSize: titleFontSize }}>
          <b>{props.title}</b>
        </Typography>
        {Object.entries(props.hints).map(([index, hint]) => {
          return (
            <div key={index}>
              <Divider flexItem />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  padding: 1,
                  paddingBottom: 5,
                  textAlign: "left"
                }}>
                <Typography>
                  <b>{hint.index}: </b>
                </Typography>
                <Typography
                  style={{
                    paddingLeft: 5,
                    textDecoration: hint.hasBeenFound ? "line-through" : "none"
                  }}>
                  {hint.text}
                  <b> ({hint.length}&nbsp;letters)</b>
                </Typography>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function HintCard(props) {
  const theme = useTheme();
  const padding = 5;
  const width = "12em";
  const height = "30em";
  const isFlipped = Object.entries(props.hints).length !== 0;
  const front = (
    <ListCard
      style={{ backgroundColor: theme.primaryColor, width: width, height: height }}
      title={props.title}
      hints={{}}
    />
  );
  const back = (
    <ListCard style={{ width: width, minHeight: height }} title={props.title} hints={props.hints} />
  );
  return (
    <div style={{ padding: padding, width: width, marginTop: 0 }}>
      <Flippable front={front} back={back} isFlipped={isFlipped} />
    </div>
  );
}

function ClickableTile(props) {
  const characterFontSize = 30;
  const indexFontSize = 12;
  return (
    <Card>
      <CardActionArea
        onClick={props.onClick}
        style={{
          ...props.style,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: props.size,
          height: props.size
        }}>
        <CardContent>
          <Typography style={{ fontSize: indexFontSize, top: 0, left: 2, position: "absolute" }}>
            <b>{props.index}</b>
          </Typography>
          <Typography style={{ fontSize: characterFontSize, marginTop: 0 }}>
            <b>{props.character}</b>
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

function CrosswordTile(props) {
  const theme = useTheme();
  const padding = 5;
  const size = 50;
  const isFlipped = props.contents.answer !== "" && !props.contents.isCorrect;
  const backColor = props.contents.isSelected ? theme.accentColor : "";
  const front = props.contents.isCorrect ? (
    <Tile
      character={props.contents.answer}
      index={props.contents.index}
      size={size}
      style={{ backgroundColor: theme.successColor }}
    />
  ) : (
    <Tile size={size} style={{ backgroundColor: theme.primaryColor }} />
  );
  const back = (
    <ClickableTile
      onClick={props.contents.onClick}
      character={props.contents.guess}
      index={props.contents.index}
      size={size}
      style={{ backgroundColor: backColor }}
    />
  );
  return (
    <div style={{ padding: padding, width: size, height: size, marginTop: 0 }}>
      <Flippable front={front} back={back} isFlipped={isFlipped} />
    </div>
  );
}

function CrosswordColumn(props) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {Array.from({ length: props.height }).map((_, y) => {
        return <CrosswordTile key={y} contents={props.columnContents[y]} />;
      })}
    </div>
  );
}

function CrosswordGrid(props) {
  return (
    <div style={{ display: "flex", flexDirection: "row", padding: 10 }}>
      {Array.from({ length: props.width }).map((_, x) => {
        return (
          <CrosswordColumn
            key={x}
            x={x}
            height={props.height}
            columnContents={props.gridContents[x]}
          />
        );
      })}
    </div>
  );
}

function Translate(position, distance, orientation) {
  if (orientation === Orientation.ACROSS) {
    return [position.x + distance, position.y];
  }
  return [position.x, position.y + distance];
}

function ParseGetResponse(json, handleTileClick) {
  const width = json.width;
  const height = json.height;
  const questions = json.questions.sort((q1, q2) => {
    const p1 = q1.position;
    const p2 = q2.position;
    return p1.x + p1.y * width - (p2.x + p2.y * width);
  });
  const gridContents = Array.from({ length: width }).map(() => {
    return Array.from({ length: height }).map(() => {
      return { answer: "" };
    });
  });
  let displayIndex = 0;
  let answerIndex = 0;
  const acrossHints = {};
  const downHints = {};
  const answers = [];
  Array.from({ length: questions.length }).map((_, i) => {
    const question = questions[i];
    Array.from({ length: question.answer.length }).map((_, j) => {
      const [x, y] = Translate(question.position, j, question.orientation);
      const gridTile = gridContents[x][y];
      if (!gridTile.answer) {
        gridTile.answer = question.answer[j];
        gridTile.isCorrect = false;
        gridTile.isIntersection = false;
        gridTile.isSelected = false;
        gridTile.onClick = () => {
          handleTileClick({ x: x, y: y, orientation: question.orientation }, gridContents);
        };
      } else {
        gridTile.isIntersection = true;
      }
    });
    const gridTile = gridContents[question.position.x][question.position.y];
    if (!gridTile.index) {
      displayIndex = displayIndex + 1;
    }
    gridTile.index = displayIndex;
    const randomHintIndex = Math.floor(Math.random() * question.hints.length);
    const hintText = question.hints[randomHintIndex];
    const hint = {
      index: displayIndex,
      text: hintText,
      length: question.answer.length,
      hasBeenFound: false
    };
    if (question.orientation === Orientation.ACROSS) {
      acrossHints[answerIndex] = hint;
    } else {
      downHints[answerIndex] = hint;
    }
    answers.push({
      position: question.position,
      orientation: question.orientation,
      length: question.answer.length
    });
    answerIndex = answerIndex + 1;
  });
  return [gridContents, acrossHints, downHints, answers];
}

export default function CrosswordPage() {
  const forceUpdate = useForceUpdate();
  const width = 15;
  const height = 15;
  const minWordLength = 3;
  const maxWordLength = 8;
  const [gridContents, setGridContents] = useState(
    Array.from({ length: width }).map(() => {
      return Array.from({ length: height }).map(() => {
        return { answer: "" };
      });
    })
  );
  const [acrossHints, setAcrossHints] = useState({});
  const [downHints, setDownHints] = useState({});
  const [answers, setAnswers] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [tileIntersectionDialogProps, setTileIntersectionDialogProps] = useState({ isOpen: false });

  const checkGuesses = () => {
    for (let index = 0; index < answers.length; index++) {
      const answer = answers[index];
      const correctGridTiles = [];
      for (let i = 0; i < answer.length; i++) {
        const [x, y] = Translate(answer.position, i, answer.orientation);
        const gridTile = gridContents[x][y];
        if (gridTile.answer === gridTile.guess) {
          correctGridTiles.push(gridTile);
        } else {
          break;
        }
      }
      if (answer.length !== correctGridTiles.length) {
        continue;
      }
      if (acrossHints[index]) {
        acrossHints[index].hasBeenFound = true;
      } else {
        downHints[index].hasBeenFound = true;
      }
      for (const correctGridTile of correctGridTiles) {
        correctGridTile.isCorrect = true;
      }
    }
    forceUpdate();
  };

  const handleKeyDown = (key) => {
    if (key === Keys.ENTER) {
      checkGuesses();
      return;
    }
    if (!selectedPosition) {
      return;
    }
    {
      const gridTile = gridContents[selectedPosition.x][selectedPosition.y];
      gridTile.guess = key.toLowerCase();
    }
    const next = (position) => {
      const [nextX, nextY] = Translate(position, 1, position.orientation);
      return {
        x: nextX,
        y: nextY,
        orientation: position.orientation
      };
    };
    let candidatePosition = null;
    let nextPosition = next(selectedPosition);
    while (nextPosition.x < width && nextPosition.y < height) {
      const gridTile = gridContents[nextPosition.x][nextPosition.y];
      if (!gridTile.answer) {
        break;
      }
      if (!gridTile.isCorrect) {
        candidatePosition = nextPosition;
        break;
      }
      nextPosition = next(nextPosition);
    }
    setSelectedPosition(candidatePosition);
  };

  const handleTileClick = (position, gridContents) => {
    const gridTile = gridContents[position.x][position.y];
    if (!gridTile.isIntersection) {
      setSelectedPosition(position);
      return;
    }
    const isNextPositionViable = (orientation) => {
      const [nextX, nextY] = Translate(position, 1, orientation);
      if (nextX < width && nextY < height) {
        const gridTile = gridContents[nextX][nextY];
        return gridTile.answer && !gridTile.isCorrect;
      }
      return false;
    };
    const viableOrientations = [];
    for (const orientation of [Orientation.ACROSS, Orientation.DOWN]) {
      if (isNextPositionViable(orientation)) {
        viableOrientations.push(orientation);
      }
    }

    if (viableOrientations.length > 1) {
      const gridTile = gridContents[position.x][position.y];
      const tileIntersectionDialogProps = {
        position: position,
        guess: gridTile.guess,
        index: gridTile.index,
        isOpen: true
      };
      setTileIntersectionDialogProps(tileIntersectionDialogProps);
    } else {
      position.orientation = viableOrientations[0];
      setSelectedPosition(position);
    }
  };

  const handleTileIntersectionDialogClose = (orientation) => {
    let position = tileIntersectionDialogProps.position;
    position.orientation = orientation
      ? orientation
      : Math.random() < 0.5
      ? Orientation.ACROSS
      : Orientation.DOWN;
    setSelectedPosition(position);
    setTileIntersectionDialogProps({ isOpen: false });
  };

  useEffect(() => {
    fetch(
      `${Api.CROSSWORD}?width=${width}&height=${height}&minWordLength=${minWordLength}&maxWordLength=${maxWordLength}`
    )
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        const [newGridContents, newAcrossHints, newDownHints, answers] = ParseGetResponse(
          json,
          handleTileClick
        );
        setGridContents(newGridContents);
        setAcrossHints(newAcrossHints);
        setDownHints(newDownHints);
        setAnswers(answers);
      })
      .catch((error) => {
        return console.error(error);
      });
  }, []);

  useMemo(() => {
    if (selectedPosition) {
      const gridTile = gridContents[selectedPosition.x][selectedPosition.y];
      gridTile.isSelected = true;
    }
  }, [selectedPosition]);
  useEffect(() => {
    if (selectedPosition) {
      const gridTile = gridContents[selectedPosition.x][selectedPosition.y];
      gridTile.isSelected = false;
    }
  }, [selectedPosition]);

  return (
    <div className="Page">
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
        <HintCard hints={acrossHints} title={"Across"} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <CrosswordGrid width={width} height={height} gridContents={gridContents} />
          <Keyboard onKeyDown={handleKeyDown} />
          <TileIntersectionDialog
            isOpen={tileIntersectionDialogProps.isOpen}
            onClose={handleTileIntersectionDialogClose}
            guess={tileIntersectionDialogProps.guess}
            index={tileIntersectionDialogProps.index}
          />
        </div>
        <HintCard hints={downHints} title={"Down"} />
      </div>
    </div>
  );
}
