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

  return (
    <Dialog onClose={handleClose} open={props.isOpen}>
      <DialogTitle sx={{ fontWeight: "bold" }}>Which direction?</DialogTitle>
      <div
        className="Align Column"
        style={{
          padding: 25,
          backgroundColor: theme.backgroundColor,
          alignItems: "center"
        }}>
        <div className="Align Row">
          <CrosswordTile tile={props.tile} ignoreSelection />
          <CrosswordTile
            tile={{
              isInPlay: true,
              guess: "→",
              isSelected: true
            }}
            onTileClick={() => handleSelection(Orientation.Across)}
          />
        </div>
        <div className="Align Row">
          <CrosswordTile
            tile={{
              isInPlay: true,
              guess: "↓",
              isSelected: true
            }}
            onTileClick={() => handleSelection(Orientation.Down)}
          />
          <CrosswordTile
            tile={{
              isInPlay: false
            }}
          />
        </div>
      </div>
    </Dialog>
  );
}
