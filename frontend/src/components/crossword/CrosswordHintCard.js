import React from "react";
import { useTheme } from "../../style/theme";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Divider } from "@mui/material";
import Flippable from "../common/Flippable";

export default function CrosswordHintCard(props) {
  const theme = useTheme();
  const { titleFontSize } = props.style;
  const internalStyle = {
    width: "100%",
    height: "100%"
  };
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
                    paddingTop: 5,
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
      style={{ ...internalStyle, backgroundColor: theme.primaryColor }}
      title={props.title}
      hints={{}}
    />
  );
  const back = (
    <CrosswordHintCardInternal style={internalStyle} title={props.title} hints={props.hints} />
  );
  return <Flippable front={front} back={back} isFlipped={isFlipped} style={props.style} />;
}
