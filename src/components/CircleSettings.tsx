import { useForm, SubmitHandler } from "react-hook-form";
import { Colour } from "./Types";
import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { colours } from "../constants/colours";
import { CaretDown, Check } from "phosphor-react";
import Button from "./Button";

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
            <div className="w-full">
              <Listbox value={selectedColour} onChange={setSelectedColour}>
                <div className="relative mt-1">
                  <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    <span className="block truncate">
                      {selectedColour.name}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <CaretDown
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {colours.map((c) => (
                        <Listbox.Option
                          key={c.id}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? `bg-[${c.hex}] 'text-amber-900`
                                : "text-gray-900"
                            }`
                          }
                          value={c}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {c.name}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                  <Check
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
          </div>
        </>
      <div className="flex flex-col gap-4 w-full text-center pt-4">
        <button type="submit">
          <Button text="Draw Circle"/>
        </button>
        <button >
          <Button text="Save Circle" variant/>
        </button>
      </div>
      </div>
    </form>
  );
};

export default CircleSettings;
