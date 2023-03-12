import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { Colour } from "./Types";
import { useState } from "react";
import { colours } from "../constants/colours";
import Button from "./Button";
import Sketch from "./Sketch";

type CircleSettingsProps = {};

export type Inputs = {
  radius: number;
  colour: Colour;
};

const CircleSettings: React.FC<CircleSettingsProps> = ({}) => {
  const [circleSketch, setCircleSketch] = useState<Inputs>();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => setCircleSketch(data);

  const [selectedColour, setSelectedColour] = useState(colours[1]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-1/2 bg-[#DB9D47]">
          <>
            <div className="sm:grid sm:grid-cols-2 sm:gap-8">
              Radius
              <input
                required
                id="radius"
                placeholder="Enter radius in cm"
                {...register("radius")}
              />
            </div>
          </>
          <div className="flex flex-col gap-4 w-full text-center pt-4">
            <button type="submit">
              <Button text="Save Circle" />
            </button>
          </div>
        </div>
      </form>
      {circleSketch && <Sketch circleSketch={circleSketch} />}
    </>
  );
};

export default CircleSettings;
