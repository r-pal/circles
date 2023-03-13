import { useForm, SubmitHandler } from "react-hook-form";
import { Colour } from "./Types";
import { useEffect, useState } from "react";
import { colours } from "../constants/colours";
import Button from "./Button";
import Sketch from "./Sketch";
import clsx from "clsx";

type CircleSettingsProps = {};

export type Inputs = {
  radius: number;
  instances: number;
  colour: Colour;
};

const CircleSettings: React.FC<CircleSettingsProps> = () => {
  const [gameResult, setGameResult] = useState<"won" | "lost">();
  const [wins, setWins] = useState(0);
  const [circleSketch, setCircleSketch] = useState<Inputs>();
  const [selectedColour, setSelectedColour] = useState("");
  const [jiggliness, setJiggliness] = useState(0);
  const { register, handleSubmit, control } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setCircleSketch(data);
    console.log(data);
  };
  // let wins = 0;

  useEffect(() => {
    if (gameResult === "won") {
      setWins(wins + 1);
    }
    if (wins === 3) {
      //enter winner board
    }
  }, [gameResult]);
  console.log("wins: ", wins);

  return (
    <div>
      <div className="bg-[#DB9D47] grid content-center h-[156px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full bg-[#DB9D47] flex flex-col items-center gap-3">
            <div>
              Size
              <input
                type="range"
                step="50"
                min="10"
                max="1010"
                className="range range-md border-[#EDFFD9]"
                id="size"
                defaultValue={50}
                {...register("radius")}
              />
            </div>
            <div>
              Number
              <input
                type="range"
                step="1"
                min="1"
                max="100"
                className="range range-md bg-[#EDFFD9]"
                id="instances"
                defaultValue={1}
                {...register("instances")}
              />
            </div>
            <div>
              Colour
              <select
                {...register("colour")}
                className={clsx(
                  "selectedColour && bg-[${selectedColour}]",
                  "selectedColour.id === 1 && text-bg-[#EDFFD9]"
                )}
                onChange={(e) => setSelectedColour(e.target.value)}
              >
                {colours.map((c) => (
                  <option
                    key={c.id}
                    value={c.hex}
                    className={clsx(`bg-[${c.hex}]`)}
                  >
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              Jiggly Factor
              <input
                type="range"
                step="1"
                min="1"
                max="10"
                value={jiggliness}
                className="range range-md"
                id="Jigglyness"
                onChange={(e) => setJiggliness(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full text-center pt-4">
            {gameResult ? (
              <button onClick={() => setGameResult(undefined)}>
                <Button text="Reset" />
              </button>
            ) : (
              <button type="submit">
                <Button text="Start game" />
              </button>
            )}
          </div>
        </form>
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
    </div>
  );
};

export default CircleSettings;
