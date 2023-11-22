import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import "../../style/common/Tile.css";

export function Tile(props) {
  const cardContent = (
    <CardContent className="Tile-content">
      <Typography className="Tile-index">
        <b>{props.index}</b>
      </Typography>
      <Typography className={`Tile-character ${props.trueCenter ? "True-center" : ""}`}>
        <b>{props.character}</b>
      </Typography>
    </CardContent>
  );
  const cardBody = props.onClick ? (
    <CardActionArea onClick={props.onClick} className="Tile-clickable-body">
      {cardContent}
    </CardActionArea>
  ) : (
    cardContent
  );

  return (
    <Card raised={props.raised} className="Tile" style={props.style}>
      {cardBody}
    </Card>
  );
}
