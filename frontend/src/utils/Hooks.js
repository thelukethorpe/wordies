import { useState } from "react";

export function useForceUpdate() {
  const [, setValue] = useState(0);
  return () => {
    return setValue((value) => {
      return value + 1;
    });
  };
}
