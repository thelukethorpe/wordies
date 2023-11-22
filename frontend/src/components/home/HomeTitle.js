import React from "react";
import HomeTitleTile from "./HomeTitleTile";
import "../../style/common/Align.css";

export default function HomeTitle(props) {
  return (
    <div className="Align Row" style={props.style}>
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
