import React from "react";
import { useTheme } from "../../style/theme";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Divider } from "@mui/material";
import Flippable from "../common/Flippable";

export default function CrosswordHintCard(props) {
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
