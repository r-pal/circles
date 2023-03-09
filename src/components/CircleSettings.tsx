import { useForm, SubmitHandler } from "react-hook-form";
import { Colour } from "./Types";
import { useState } from "react";
import { Listbox } from "@headlessui/react";
import { colours } from "../constants/colours";

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
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  const [selectedColour, setSelectedColour] = useState(colours[0]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <>
        <div className="sm:grid sm:grid-cols-2 sm:gap-8 bg-[#DB9D47]">
          Radius
          <input
            required
            id="radius"
            placeholder="Enter radius in cm"
            {...register("radius")}
          />
          Colour
          <Listbox value={selectedColour} onChange={setSelectedColour}>
            <Listbox.Button>{selectedColour.name}</Listbox.Button>
            <Listbox.Options>
              {colours.map((c) => (
                <Listbox.Option
                  key={c.id}
                  value={c.hex}
                >
                  {c.name}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Listbox>
          <button type="submit">Draw Circle</button>
        </div>
      </>
    </form>
  );
};

export default CircleSettings;
