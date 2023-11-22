import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../style/theme";
import { Path } from "../../constants/Path";
import { Button, Dialog, DialogTitle } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

export default function CrosswordCompleteDialog(props) {
  const navigate = useNavigate();
  const theme = useTheme();
  const navigateHome = () => {
    navigate(Path.Home);
  };
  const playAgain = () => {
    window.location.reload();
  };

  return (
    <Dialog onClose={playAgain} open={props.isOpen}>
      <DialogTitle sx={{ fontWeight: "bold" }}>🎉 Congratulations! 🎉</DialogTitle>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          backgroundColor: theme.backgroundColor
        }}>
        <Button variant="contained" onClick={playAgain} size="large">
          Play again
        </Button>
        <br />
        <Button variant="contained" onClick={navigateHome} size="large" endIcon={<HomeIcon />}>
          Home
        </Button>
      </div>
    </Dialog>
  );
}
