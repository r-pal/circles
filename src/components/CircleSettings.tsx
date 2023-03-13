import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { Colour } from "./Types";
import { Fragment, useEffect, useState } from "react";
import { colours } from "../constants/colours";
import Button from "./Button";
import Sketch from "./Sketch";
import { Listbox, Transition } from "@headlessui/react";
import { CaretDown, Check } from "phosphor-react";
import clsx from "clsx";

type CircleSettingsProps = {};

export type Inputs = {
  radius: number;
  colour: Colour;
};

const CircleSettings: React.FC<CircleSettingsProps> = ({}) => {
  const [circleSketch, setCircleSketch] = useState<Inputs>();
  const [selectedColour, setSelectedColour] = useState("");
  const [jiggliness, setJiggliness] = useState(0);
  console.log(jiggliness);
  const { register, handleSubmit, control } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setCircleSketch(data);
    console.log(data);
  };
  // const selectedColour = useWatch({ control, name: "colour" });

  return (
    <>
      <div className="bg-[#DB9D47] grid content-center">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full bg-[#DB9D47] flex flex-col items-center gap-3">
            <div>
              Radius (px)
              <input
                required
                id="radius"
                placeholder="Enter radius in px"
                defaultValue={50}
                {...register("radius")}
                className="w-5 bg-[#EDFFD9]"
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
            <button type="submit">
              <Button text="Start game" />
            </button>
          </div>
        </form>
      </div>
      <div className="bg-[#315964]">
        {circleSketch && (
          <Sketch circleSketch={circleSketch} jiggliness={jiggliness} />
        )}
      </div>
    </>
  );
};

export default CircleSettings;
