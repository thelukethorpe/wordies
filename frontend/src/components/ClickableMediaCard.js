import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";

export default function ClickableMediaCard(props) {
  return (
    <Card sx={props.style}>
      <CardActionArea onClick={props.onClick}>
        <CardMedia
          component="img"
          height="140"
          image={props.image}
          alt={props.title}
          sx={{ objectFit: "cover", objectPosition: "0 0" }}
        />
        <CardContent sx={{ borderTop: props.style.border }}>
          <Typography gutterBottom variant="h5" component="div">
            {props.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {props.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
