import React from "react";
import Card from "@mui/material/Card";
import { CardActionArea } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

function Key(props) {
  const characterFontSize = 30;
  const padding = 5;
  const size = 50;
  return (
    <Card style={{ padding: padding }}>
      <CardActionArea
        onClick={props.onClick}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: size,
          height: size
        }}>
        <CardContent>
          <Typography style={{ fontSize: characterFontSize, marginTop: 0 }}>
            <b>{props.character}</b>
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
    ["Z", "X", "C", "V", "B", "N", "M"]
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {Array.from(keys).map((keyRow, y) => {
        return (
          <div key={y} style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
            {Array.from(keyRow).map((key, x) => {
              return (
                <div key={x} style={{ padding: padding }}>
                  {" "}
                  <Key
                    character={key}
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
