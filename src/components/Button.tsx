import clsx from "clsx";

type ButtonProps = {
  text: string;
  variant?: boolean;
};

const Button: React.FC<ButtonProps> = ({ text, variant }) => {
  return (
    <div
      className="group relative inline-block text-sm font-medium focus:outline-none focus:ring text-[#3A3042]"
    >
      <span className={clsx( "block px-12 py-3 rounded-full transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1", 
      variant ? "border border-[#3A3042]" : "bg-[#EDFFD9]"  )}>
        {text}
      </span>
    </div>
  );
};

export default Button;
