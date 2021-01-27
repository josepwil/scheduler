import React, { useState } from "react";

const useVisualMode = function (initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = function (newMode, replace = false) {
    setMode((prev) => newMode);
    replace
      ? setHistory((prev) => [...prev.slice(0, prev.length - 1), newMode])
      : setHistory((prev) => [...prev, newMode]);
  };

  const back = function () {
    if (history.length > 1) {
      setMode((prev) => [...history.slice(0, history.length - 1).slice(-1)][0]);
      setHistory((prev) => [...prev.slice(0, history.length - 1)]);
    }
  };

  return { mode, transition, back };
};

export default useVisualMode;
