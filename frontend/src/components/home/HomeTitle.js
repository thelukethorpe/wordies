import React from "react";
import HomeTitleTile from "./HomeTitleTile";

export default function HomeTitle(props) {
  return (
    <div
      style={{ ...props.style, display: "flex", flexDirection: "row", justifyContent: "center" }}>
      {Array.from({ length: props.title.length }).map((_, index) => (
        <HomeTitleTile
          key={index}
          character={props.title[index]}
          index={index + 1}
          isFlipped={props.isFlipped[index]}
        />
      ))}
    </div>
  );
}
