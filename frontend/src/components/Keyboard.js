import React from "react";
import Card from "@mui/material/Card";
import { CardActionArea } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useTheme } from "../theme";
import Keys from "../constants/Keys";

const CHECK_TEXT = "CHECK GUESSES";

function TextToKey(text) {
  if (text === CHECK_TEXT) {
    return Keys.ENTER;
  }
  return text;
}

function Key(props) {
  const theme = useTheme();
  const padding = 5;
  const size = 50;
  const style =
    props.keyValue === Keys.ENTER
      ? {
          backgroundColor: theme.successColor,
          fontSize: 20,
          color: "common.white",
          height: size
        }
      : {
          fontSize: 30,
          width: size,
          height: size
        };
  return (
    <Card
      style={{
        ...style,
        padding: padding
      }}>
      <CardActionArea
        onClick={props.onClick}
        style={{
          ...style,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
        <CardContent>
          <Typography style={{ fontSize: style.fontSize, marginTop: 0 }} color={style.color}>
            <b>{props.text}</b>
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function Keyboard(props) {
  const padding = 5;
  const keys = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M", CHECK_TEXT]
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {Array.from(keys).map((keyRow, y) => {
        return (
          <div key={y} style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
            {Array.from(keyRow).map((text) => {
              const key = TextToKey(text);
              return (
                <div key={key} style={{ padding: padding }}>
                  {" "}
                  <Key
                    keyValue={key}
                    text={text}
                    onClick={() => {
                      return props.onKeyDown(key);
                    }}
                  />{" "}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
