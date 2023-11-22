import React from "react";
import "../../style/common/Flippable.css";

export default function Flippable(props) {
  return (
    <div className={`Flippable ${props.isFlipped ? "Flipped" : ""}`}>
      <div className="Flippable-front">{props.front}</div>
      <div className="Flippable-back">{props.back}</div>
    </div>
  );
}
