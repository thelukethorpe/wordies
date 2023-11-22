import React from "react";
import { useTheme } from "../../style/theme";
import { Tile } from "../common/Tile";
import Flippable from "../common/Flippable";

export default function CrosswordTile(props) {
  const theme = useTheme();
  const style = {
    marginTop: 0,
    padding: `${0.1}em`
  };
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
      style={{ backgroundColor: frontColor }}
    />
  );
  const back = (
    <Tile
      onClick={handleTileClick}
      character={props.tile.guess}
      index={props.tile.index}
      trueCenter={props.trueCenter}
      style={{ backgroundColor: backColor }}
    />
  );
  return <Flippable front={front} back={back} isFlipped={isFlipped} style={style} />;
}
