import clsx from "clsx";

type ButtonProps = {
  text?: string;
  type: "button" | "submit" | "reset";
  variant?: boolean;
  form?: string;
  disabled?: boolean;
  header?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  text,
  variant,
  form,
  type,
  disabled,
  header,
}) => (
  <button
    className={clsx(
      "text-sm p-1 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
      variant
        ? "text-foreground hover:bg-foreground/10"
        : "bg-btn-fill text-btn-text hover:opacity-90"
    )}
    form={form}
    type={type}
    disabled={disabled}
  >
    {header ? <h1 className="text-btn-text xl:text-4xl">{text}</h1> : text}
  </button>
);

export default Button;
