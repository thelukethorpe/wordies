import React from "react";
import "../../style/common/Figure.css";

export default function Figure(props) {
  const { style, contents, caption } = props;
  return (
    <div className="Figure" style={style}>
      <div className="Figure-contents">{contents}</div>
      <div className="Figure-caption">{caption}</div>
    </div>
  );
}
