import React from "react";
import { Position } from "../../model/crossword/Position";
import CrosswordTile from "./CrosswordTile";
import "../../style/common/Align.css";

export default function CrosswordGrid(props) {
  return (
    <div className="Align Row" style={{ padding: 10 }}>
      {Array.from({ length: props.crossword.width }).map((_, x) => (
        <div key={x} className="Align Column">
          {Array.from({ length: props.crossword.height }).map((_, y) => {
            const position = new Position(x, y);
            return (
              <CrosswordTile
                key={y}
                position={position}
                tile={props.crossword.getTile(position)}
                onTileClick={props.onTileClick}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
