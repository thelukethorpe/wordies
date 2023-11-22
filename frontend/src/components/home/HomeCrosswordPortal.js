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

export default function HomeCrosswordPortal() {
  const navigate = useNavigate();
  const theme = useTheme();
  const portalTitle = "crosswords";
  const tileIndices = [1];
  const tilePadding = 2;
  const tileSize = 50;
  return (
    <Card style={{ backgroundColor: theme.accentColor, padding: 5 }} raised={true}>
      <CardContent className="Align Column">
        <div
          className="Align Row"
          style={{
            paddingBottom: 15
          }}>
          {Array.from({ length: portalTitle.length }).map((_, index) => (
            <div
              key={index}
              style={{
                padding: tilePadding
              }}>
              <Tile character={portalTitle[index]} index={tileIndices[index]} size={tileSize} />
            </div>
          ))}
        </div>
        <div>
          <CrosswordHintCard
            title="Across"
            hints={[
              {
                index: 1,
                text: "A classic word-deduction game with AI-generated clues.",
                length: 10
              }
            ]}
            style={{ titleFontSize: 20 }}
            verticalPadding={5}
          />
          <Button
            variant="contained"
            style={{ backgroundColor: theme.successColor, width: "100%" }}
            onClick={() => {
              navigate(Path.Crossword);
            }}>
            Play
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
