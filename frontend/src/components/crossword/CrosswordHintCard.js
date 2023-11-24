import React from "react";
import { useTheme } from "../../style/theme";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Divider } from "@mui/material";
import Flippable from "../common/Flippable";
import "../../style/crossword/CrosswordHintCard.css";

export default function CrosswordHintCard(props) {
  const theme = useTheme();
  const isFlipped = props.hints && Object.entries(props.hints).length !== 0;
  function CrosswordHintCardInternal(props) {
    return (
      <Card className="Crossword-hint-card" style={props.style}>
        <CardContent className="Crossword-hint-card-content">
          <Typography className="Crossword-hint-card-title">
            <b>{props.title}</b>
          </Typography>
          {Object.entries(props.hints).map(([index, hint]) => {
            return (
              <div key={index}>
                <Divider flexItem />
                <div className="Crossword-hint-card-hint-div">
                  <Typography className="Crossword-hint-card-hint-text">
                    <b>{hint.index}: </b>
                  </Typography>
                  <Typography
                    className="Crossword-hint-card-hint-text Main"
                    style={{
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
      style={{ backgroundColor: theme.primaryColor }}
      title={props.title}
      hints={{}}
    />
  );
  const back = <CrosswordHintCardInternal title={props.title} hints={props.hints} />;
  return <Flippable front={front} back={back} isFlipped={isFlipped} style={props.style} />;
}
