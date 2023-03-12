import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { Colour } from "./Types";
import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { colours } from "../constants/colours";
import { CaretDown, Check } from "phosphor-react";
import Button from "./Button";
import Sketch from "./Sketch";

type CircleSettingsProps = {};

type Inputs = {
  radius: number;
  colour: Colour;
};

const CircleSettings: React.FC<CircleSettingsProps> = ({}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  const [selectedColour, setSelectedColour] = useState(colours[0]);

  const radius = useWatch({ control, name: "radius" });

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
              Colour
            </div>
          </>
          <div className="flex flex-col gap-4 w-full text-center pt-4">
            <button type="submit">
              <Button text="Save Circle" />
            </button>
          </div>
        </div>
      </form>
      <Sketch radius={radius} colourHex={selectedColour.hex} />
    </>
  );
};

export default CircleSettings;
