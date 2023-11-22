import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";

export function Tile(props) {
  const scale = props.size / 50;
  const characterFontSize = 30 * scale;
  const indexFontSize = 12 * scale;
  const left = 2 * scale;
  const style = {
    ...props.style,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: props.size,
    height: props.size,
    position: "relative"
  };
  const cardContent = (
    <CardContent>
      <Typography style={{ fontSize: indexFontSize, top: 0, left: left, position: "absolute" }}>
        <b>{props.index}</b>
      </Typography>
      <Typography style={{ fontSize: characterFontSize, marginTop: 5 }}>
        <b>{props.character}</b>
      </Typography>
    </CardContent>
  );

  if (props.onClick) {
    return (
      <Card raised={props.raised}>
        <CardActionArea onClick={props.onClick} style={style}>
          {cardContent}
        </CardActionArea>
      </Card>
    );
  }

  return (
    <Card raised={props.raised} style={style}>
      {cardContent}
    </Card>
  );
}
