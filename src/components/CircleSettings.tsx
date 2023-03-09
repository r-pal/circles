import { useForm, SubmitHandler } from "react-hook-form";
import { Colour } from "./Types";

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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <>
        <div className="sm:grid sm:grid-cols-2 sm:gap-8">
          <input
            required
            id="radius"
            placeholder="Enter radius in cm"
            {...register("radius")}
          />
        </div>
      </>
    </form>
  );
};

export default CircleSettings;
