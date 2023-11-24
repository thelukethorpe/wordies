import React, { useEffect, useState } from "react";
import Keyboard from "../components/common/Keyboard";
import { useForceUpdate } from "../utils/Hooks";
import { Orientation, OrientationUtils } from "../model/crossword/Orientation";
import ConfettiExplosion from "react-confetti-explosion";
import { CrosswordBuilder, CrosswordGameController } from "../model/crossword/Crossword";
import { Position } from "../model/crossword/Position";
import { Api } from "../constants/Api";
import { Key } from "../constants/Key";
import { Random } from "../utils/Maths";
import CrosswordCompleteDialog from "../components/crossword/CrosswordCompleteDialog";
import CrosswordTileIntersectionDialog from "../components/crossword/CrosswordTileIntersectionDialog";
import CrosswordHintCard from "../components/crossword/CrosswordHintCard";
import CrosswordGrid from "../components/crossword/CrosswordGrid";
import "../style/common/Align.css";
import "../style/common/Page.css";

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
      fontSize: "0.55em",
      width: "18em",
      height: "100%"
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
      <div className="Align Row">
        <div>
          <CrosswordHintCard
            hints={crosswordGameController.getHints(Orientation.Across)}
            title={"Across"}
            style={styles.hintCard}
          />
        </div>
        {isConfettiExploding && (
          <ConfettiExplosion duration={10000} particleSize={15} width={1600} />
        )}
        <div className="Align Column">
          <CrosswordGrid
            crossword={crosswordGameController.crossword}
            onTileClick={handleTileClick}
          />
          <Keyboard onKeyDown={handleKeyDown} />
          <CrosswordTileIntersectionDialog
            isOpen={tileIntersectionDialogProps.isOpen}
            onClose={handleTileIntersectionDialogClose}
            tile={tileIntersectionDialogProps.tile}
          />
          <CrosswordCompleteDialog isOpen={isGameWonDialogOpen} />
        </div>
        {isConfettiExploding && (
          <ConfettiExplosion duration={10000} particleSize={15} width={1600} />
        )}
        <div>
          <CrosswordHintCard
            hints={crosswordGameController.getHints(Orientation.Down)}
            title={"Down"}
            style={styles.hintCard}
          />
        </div>
      </div>
    </div>
  );
}
