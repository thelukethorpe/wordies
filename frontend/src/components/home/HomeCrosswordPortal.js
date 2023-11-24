import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../style/theme";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Tile } from "../common/Tile";
import CrosswordHintCard from "../crossword/CrosswordHintCard";
import { Button } from "@mui/material";
import { Path } from "../../constants/Path";
import "../../style/common/Align.css";
import Figure from "../common/Figure";

export default function HomeCrosswordPortal() {
  const navigate = useNavigate();
  const theme = useTheme();
  const portalTitle = "crosswords";
  const tileIndices = [1];
  const elementStyle = {
    padding: `${0.1}em`,
    paddingTop: `${0.15}em`,
    paddingBottom: `${0.15}em`
  };

  const figureContents = (
    <div className="Align Row">
      {Array.from({ length: portalTitle.length }).map((_, index) => (
        <div key={index} style={elementStyle}>
          <Tile character={portalTitle[index]} index={tileIndices[index]} />
        </div>
      ))}
    </div>
  );
  const figureCaption = (
    <div style={{ fontSize: `${0.8}em` }}>
      <CrosswordHintCard
        title="Across"
        hints={[
          {
            index: 1,
            text: "A classic word-deduction game with AI-generated clues.",
            length: 10
          }
        ]}
        style={elementStyle}
      />
      <div style={elementStyle}>
        <Button
          variant="contained"
          style={{
            fontSize: `${0.8}em`,
            backgroundColor: theme.successColor,
            width: "100%"
          }}
          onClick={() => {
            navigate(Path.Crossword);
          }}>
          Play
        </Button>
      </div>
    </div>
  );
  return (
    <Card style={{ backgroundColor: theme.accentColor, padding: 5 }} raised={true}>
      <CardContent>
        <Figure contents={figureContents} caption={figureCaption} />
      </CardContent>
    </Card>
  );
}
