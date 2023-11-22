import React from "react";
import { useTheme } from "../../style/theme";
import { Tile } from "../common/Tile";
import Flippable from "../common/Flippable";
import ClickableTile from "../common/ClickableTile";

export default function CrosswordTile(props) {
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
    <Flippable
      front={front}
      back={back}
      isFlipped={isFlipped}
      style={{ padding: padding, marginTop: 0 }}
    />
  );
}
