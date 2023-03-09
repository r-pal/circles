import { useForm, SubmitHandler } from "react-hook-form";
import { Colour } from "./Types";
import { useState } from 'react'
import { Listbox } from '@headlessui/react'

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

  const colours = [
    {id: 1, name: "Dark purple", hex:"#3A3042"},
    {id: 2, name: "Earth yellow", hex:"#DB9D47"},
    {id: 3, name: "Coral", hex:"#FF784F"},
    {id: 4, name: "Peach Yellow", hex:"#FFE19C"},
    {id: 5, name: "Nyanza", hex:"#EDFFD9"}]

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
          <input
            required
            id="radius"
            placeholder="Choose colour"
            {...register("radius")}
          />
          <button type="submit">Draw Circle</button>
        </div>
      </>
    </form>
  );
};

export default CircleSettings;
