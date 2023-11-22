import React from "react";
import { useTheme } from "../../style/theme";
import { Dialog, DialogTitle } from "@mui/material";
import { Orientation } from "../../model/crossword/Orientation";
import CrosswordTile from "./CrosswordTile";
import "../../style/common/Align.css";

export default function CrosswordTileIntersectionDialog(props) {
  const theme = useTheme();
  const handleClose = () => {
    props.onClose(null);
  };

  const handleSelection = (orientation) => {
    props.onClose(orientation);
  };

  function CrosswordTileInternal(props) {
    return (
      <div style={{ fontSize: "10vmin" }}>
        <CrosswordTile
          tile={props.tile}
          onTileClick={props.onTileClick}
          ignoreSelection={props.ignoreSelection}
          trueCenter={props.trueCenter}
        />
      </div>
    );
  }

  return (
    <Dialog onClose={handleClose} open={props.isOpen}>
      <DialogTitle sx={{ fontWeight: "bold" }}>Which direction?</DialogTitle>
      <div
        className="Align Column"
        style={{
          padding: `${2}em`,
          backgroundColor: theme.backgroundColor,
          alignItems: "center"
        }}>
        <div className="Align Row">
          <CrosswordTileInternal tile={props.tile} ignoreSelection />
          <CrosswordTileInternal
            tile={{
              isInPlay: true,
              guess: "→",
              isSelected: true
            }}
            trueCenter
            onTileClick={() => handleSelection(Orientation.Across)}
          />
        </div>
        <div className="Align Row">
          <CrosswordTileInternal
            tile={{
              isInPlay: true,
              guess: "↓",
              isSelected: true
            }}
            trueCenter
            onTileClick={() => handleSelection(Orientation.Down)}
          />
          <CrosswordTileInternal
            tile={{
              isInPlay: false
            }}
          />
        </div>
      </div>
    </Dialog>
  );
}
