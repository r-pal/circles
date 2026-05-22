import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { colours } from "../constants/colours";
import clsx from "clsx";
import { secondaryColour } from "../utils/textColour";

export type Settings = {
  radius: number;
  colour1: string;
  colour2: string;
  jiggliness: number;
};

type CircleSettingsProps = {
  setSettings: (value: Settings) => void;
};

const CircleSettings: React.FC<CircleSettingsProps> = ({ setSettings }) => {
  const [selectedColourHex, setSelectedColourHex] = useState("#EDFFD9");
  const { register, handleSubmit } = useForm<Settings>();

  const onSubmit: SubmitHandler<Settings> = (data) => {
    data.colour2 = secondaryColour(selectedColourHex);
    setSettings(data);
  };

  return (
    <div>
      <form id="settings" onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full flex flex-col items-left gap-3 text-foreground border-foreground accent-accent">
          <div>
            Size
            <input
              type="range"
              step="50"
              min="10"
              max="1010"
              className="range range-md"
              id="size"
              defaultValue={60}
              {...register("radius")}
            />
          </div>
          <div className="flex-col">
            <div>Colour</div>
            <select
              {...register("colour1")}
              className={clsx(
                `select
                bg-[${selectedColourHex}] 
                 hover:bg-[${selectedColourHex}]`
              )}
              onChange={(e) => setSelectedColourHex(e.target.value)}
              value={selectedColourHex}
            >
              {colours.map((c) => (
                <option
                  key={c.primary}
                  value={c.primary}
                  className={clsx(`bg-[${c.primary}] text-[${c.secondary}]`)}
                >
                  {c.label}
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
              defaultValue={5}
              className="range range-md"
              id="jiggliness"
              {...register("jiggliness")}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CircleSettings;
