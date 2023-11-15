import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useTheme } from "../theme";
import Flippable from "../components/Flippable";
import { Button, CardActionArea, Dialog, DialogTitle, Divider } from "@mui/material";
import Keyboard from "../components/Keyboard";
import { useForceUpdate } from "../utils/Hooks";
import { Tile } from "../components/Tile";
import { Orientation, OrientationUtils } from "../model/crossword/Orientation";
import ConfettiExplosion from "react-confetti-explosion";
import { Path } from "../constants/Path";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import { CrosswordBuilder, CrosswordGameController } from "../model/crossword/Crossword";
import { Position } from "../model/crossword/Position";
import { Api } from "../constants/Api";
import { Key } from "../constants/Key";
import { Random } from "../utils/Maths";

function CrosswordCompleteDialog(props) {
  const navigate = useNavigate();
  const theme = useTheme();
  const navigateHome = () => {
    navigate(Path.Home);
  };
  const playAgain = () => {
    window.location.reload();
  };

  return (
    <Dialog onClose={playAgain} open={props.isOpen}>
      <DialogTitle sx={{ fontWeight: "bold" }}>🎉 Congratulations! 🎉</DialogTitle>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          backgroundColor: theme.backgroundColor
        }}>
        <Button variant="contained" onClick={playAgain} size="large">
          Play again
        </Button>
        <br />
        <Button variant="contained" onClick={navigateHome} size="large" endIcon={<HomeIcon />}>
          Home
        </Button>
      </div>
    </Dialog>
  );
}
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
          <CrosswordTile tile={props.tile} ignoreSelection />
          <CrosswordTile
            tile={{
              isInPlay: true,
              guess: "→",
              isSelected: true
            }}
            onTileClick={() => handleSelection(Orientation.Across)}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
          <CrosswordTile
            tile={{
              isInPlay: true,
              guess: "↓",
              isSelected: true
            }}
            onTileClick={() => handleSelection(Orientation.Down)}
          />
          <CrosswordTile
            tile={{
              isInPlay: false
            }}
          />
        </div>
      </div>
    </Dialog>
  );
}

export function CrosswordHintCard(props) {
  const theme = useTheme();
  const { padding, width, height, titleFontSize } = props.style;
  const verticalPadding = props.verticalPadding !== undefined ? props.verticalPadding : 10;
  const isFlipped = props.hints && Object.entries(props.hints).length !== 0;
  function CrosswordHintCardInternal(props) {
    return (
      <Card style={props.style}>
        <CardContent style={{ paddingTop: verticalPadding, paddingBottom: verticalPadding }}>
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
                      textDecoration: hint.hasBeenGuessedCorrectly ? "line-through" : "none"
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
  const front = (
    <CrosswordHintCardInternal
      style={{ ...props.style, backgroundColor: theme.primaryColor, width: width, height: height }}
      title={props.title}
      hints={{}}
    />
  );
  const back = (
    <CrosswordHintCardInternal
      style={{ ...props.style, width: width, minHeight: height }}
      title={props.title}
      hints={props.hints}
    />
  );
  return (
    <div style={{ padding: padding, width: width, minHeight: height, marginTop: 0 }}>
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
  const handleTileClick = () => {
    props.onTileClick(props.position);
  };
  const isFlipped = props.tile.isInPlay && !props.tile.hasBeenGuessedCorrectly;
  const frontColor = props.tile.hasBeenGuessedCorrectly ? theme.successColor : theme.primaryColor;
  const backColor = !props.ignoreSelection && props.tile.isSelected ? theme.accentColor : "";
  const front = (
    <Tile
      character={props.tile.guess}
      index={props.tile.index}
      size={size}
      style={{ backgroundColor: frontColor }}
    />
  );
  const back = (
    <ClickableTile
      onClick={handleTileClick}
      character={props.tile.guess}
      index={props.tile.index}
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

function CrosswordGrid(props) {
  return (
    <div style={{ display: "flex", flexDirection: "row", padding: 10 }}>
      {Array.from({ length: props.crossword.width }).map((_, x) => (
        <div key={x} style={{ display: "flex", flexDirection: "column" }}>
          {Array.from({ length: props.crossword.height }).map((_, y) => {
            const position = new Position(x, y);
            return (
              <CrosswordTile
                key={y}
                position={position}
                tile={props.crossword.getTile(position)}
                onTileClick={props.onTileClick}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

function ParseGetResponse(json) {
  const crosswordBuilder = new CrosswordBuilder(json.width, json.height);
  const questions = json.questions.sort((q1, q2) => {
    const p1 = q1.position;
    const p2 = q2.position;
    return p1.x + p1.y * json.width - (p2.x + p2.y * json.width);
  });
  for (const question of questions) {
    const position = new Position(question.position.x, question.position.y);
    const orientation = OrientationUtils.fromString(question.orientation);
    const hintText = question.hints[Random.randomInteger(question.hints.length)];
    const answerText = question.answer;
    crosswordBuilder.addHintAndAnswer(position, orientation, hintText, answerText);
  }
  return new CrosswordGameController(crosswordBuilder.build());
}

export default function CrosswordPage() {
  const styles = {
    hintCard: {
      padding: 5,
      width: "12em",
      height: "30em",
      titleFontSize: 30
    }
  };
  const forceUpdate = useForceUpdate();
  const [crosswordGameController, setCrosswordGameController] = useState(
    new CrosswordGameController(new CrosswordBuilder(/* width */ 15, /* height */ 15).build())
  );
  const [isConfettiExploding, setIsConfettiExploding] = useState(false);
  const [isGameWonDialogOpen, setIsGameWonDialogOpen] = useState(false);
  const [tileIntersectionDialogProps, setTileIntersectionDialogProps] = useState({ isOpen: false });

  const handleKeyDown = (key) => {
    if (key === Key.Enter) {
      if (crosswordGameController.checkGuesses()) {
        setIsConfettiExploding(true);
        setTimeout(() => {
          setIsGameWonDialogOpen(true);
        }, 2500);
      }
    } else {
      crosswordGameController.makeGuess(key.toLowerCase());
    }
    forceUpdate();
  };

  const handleTileClick = (position) => {
    const viableOrientations = Object.keys(Orientation)
      .filter((key) => isNaN(Number(key)))
      .map((key) => Orientation[key])
      .filter((orientation) => {
        crosswordGameController.select(position, orientation);
        return crosswordGameController.nextSelection(orientation);
      });
    if (viableOrientations.length > 1) {
      const tile = crosswordGameController.crossword.getTile(position);
      setTileIntersectionDialogProps({
        position: position,
        tile: tile,
        isOpen: true
      });
    } else {
      crosswordGameController.select(position, viableOrientations[0]);
    }
    forceUpdate();
  };

  const handleTileIntersectionDialogClose = (orientation) => {
    let position = tileIntersectionDialogProps.position;
    orientation = orientation ? orientation : OrientationUtils.random();
    crosswordGameController.select(position, orientation);
    tileIntersectionDialogProps.isOpen = false;
    setTileIntersectionDialogProps({ isOpen: false, tile: tileIntersectionDialogProps.tile });
  };

  useEffect(() => {
    fetch(Api.Crossword)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        return ParseGetResponse(json);
      })
      .then((crosswordGameController) => {
        setCrosswordGameController(crosswordGameController);
      })
      .catch((error) => {
        return console.error(error);
      });
  }, []);

  return (
    <div className="Page">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center"
        }}>
        <CrosswordHintCard
          hints={crosswordGameController.getHints(Orientation.Across)}
          title={"Across"}
          style={styles.hintCard}
        />
        {isConfettiExploding && (
          <ConfettiExplosion duration={10000} particleSize={15} width={1600} />
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}>
          <CrosswordGrid
            crossword={crosswordGameController.crossword}
            onTileClick={handleTileClick}
          />
          <Keyboard onKeyDown={handleKeyDown} />
          <TileIntersectionDialog
            isOpen={tileIntersectionDialogProps.isOpen}
            onClose={handleTileIntersectionDialogClose}
            tile={tileIntersectionDialogProps.tile}
          />
          <CrosswordCompleteDialog isOpen={isGameWonDialogOpen} />
        </div>
        {isConfettiExploding && (
          <ConfettiExplosion duration={10000} particleSize={15} width={1600} />
        )}
        <CrosswordHintCard
          hints={crosswordGameController.getHints(Orientation.Down)}
          title={"Down"}
          style={styles.hintCard}
        />
      </div>
    </div>
  );
}
