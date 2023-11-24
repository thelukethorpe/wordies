import React from "react";
import Card from "@mui/material/Card";
import { CardActionArea } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useTheme } from "../../style/theme";
import { Key } from "../../constants/Key";
import "../../style/common/Align.css";
import "../../style/common/Keyboard.css";

const CHECK_TEXT = "CHECK GUESSES";

function TextToKey(text) {
  if (text === CHECK_TEXT) {
    return Key.Enter;
  }
  return text;
}

function GetStyles(keyValue) {
  const theme = useTheme();
  let styles = {
    textClassName: "Key-button-text",
    style: {},
    fontStyle: {}
  };
  if (keyValue === Key.Enter) {
    styles.textClassName = "Key-button-text Small";
    styles.style = {
      backgroundColor: theme.successColor
    };
    styles.fontStyle = {
      color: "common.white",
      fontSize: "0.5em"
    };
  }
  return styles;
}

function KeyButton(props) {
  const { textClassName, style, fontStyle } = GetStyles(props.keyValue);
  return (
    <Card className="Key-button" style={style}>
      <CardActionArea className="Key-button-clickable-body" onClick={props.onClick}>
        <CardContent className="Key-button-content">
          <Typography className={textClassName} style={fontStyle} color={fontStyle.color}>
            <b>{props.text}</b>
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function Keyboard(props) {
  const keys = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M", CHECK_TEXT]
  ];
  return (
    <div className="Align Column">
      {Array.from(keys).map((keyRow, y) => {
        return (
          <div key={y} className="Align Row">
            {Array.from(keyRow).map((text) => {
              const key = TextToKey(text);
              return (
                <div key={key} className="Key-button-div">
                  <KeyButton
                    keyValue={key}
                    text={text}
                    onClick={() => {
                      return props.onKeyDown(key);
                    }}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
