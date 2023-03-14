import { Faders } from "phosphor-react";
import { useState, useEffect } from "react";
import Button from "./Button";
import CircleSettings, { Inputs } from "./CircleSettings";
import Footer from "./Footer";
import Sketch from "./Sketch";

const App: React.FC = () => {
  const [gameResult, setGameResult] = useState<"won" | "lost">();
  const [wins, setWins] = useState(0);
  const [circleSketch, setCircleSketch] = useState<Inputs>();
  const [jiggliness, setJiggliness] = useState(0);

  useEffect(() => {
    if (gameResult === "won") {
      setWins(wins + 1);
    }
    if (wins === 3) {
      //enter winner board
    }
  }, [gameResult]);
  return (
    <div>
      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <div className="bg-[#3A3042] h-[156px] flex justify-between">
            <h1 className="text-[#EDFFD9] text-3xl text-center ">CIRCLES</h1>
            <div className="flex flex-col gap-4 w-full text-center pt-4">
              {gameResult ? (
                <button
                  form="settings"
                  onClick={() => setGameResult(undefined)}
                >
                  <Button text="Play again" />
                </button>
              ) : (
                <button form="settings" type="submit">
                  <Button text="Start game" />
                </button>
              )}
            </div>
            <label
              htmlFor="my-drawer"
              className="btn rounded-full bg-[#EDFFD9]"
            >
              <Faders size={32} className="text-[#3A3042]" />
            </label>
          </div>
          <div className="bg-[#315964]">
            {circleSketch && gameResult === undefined && (
              <Sketch
                circleSketch={circleSketch}
                jiggliness={jiggliness}
                setGameResult={setGameResult}
              />
            )}
            {gameResult === "won" && (
              <h1 className="text-[#EDFFD9] text-9xl text-center ">WINNER</h1>
            )}
            {gameResult === "lost" && (
              <h1 className="text-[#EDFFD9] text-9xl text-center ">YOU LOSE</h1>
            )}
          </div>
          <Footer />
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer" className="drawer-overlay"></label>
          <ul className="menu p-4 w-80 bg-[#DB9D47]">
            <CircleSettings setCircleSketch={setCircleSketch} />
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
