import React from "react";
import { useTheme } from "../../style/theme";
import { Tile } from "../common/Tile";
import Flippable from "../common/Flippable";

export default function HomeTitleTile(props) {
  const theme = useTheme();
  const padding = 5;
  const size = 100;
  const front = (
    <Tile
      character={props.character}
      size={size}
      style={{
        backgroundColor: theme.accentColor
      }}
      raised={true}
    />
  );
  const back = <Tile character={props.character} index={props.index} size={size} raised={true} />;
  return (
    <div style={{ padding: padding, width: size, height: size, marginTop: 0 }}>
      <Flippable front={front} back={back} isFlipped={props.isFlipped} />
    </div>
  );
}
