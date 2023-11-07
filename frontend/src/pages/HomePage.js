import React from "react";
import "./Page.css";
import ClickableMediaCard from "../components/ClickableMediaCard";
import CrosswordImage from "../assets/images/crossword.jpg";
import Paths from "../constants/Paths";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="Page">
      <Typography variant="h2" style={{ padding: 10 }}>
        wordies
      </Typography>
      <ClickableMediaCard
        title="Crosswords"
        description="Cross some words!"
        image={CrosswordImage}
        onClick={() => {
          return navigate(Paths.CROSSWORD);
        }}
        style={{ width: 345, border: 2, boxShadow: 10 }}
      />
    </div>
  );
}
