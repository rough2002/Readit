import { ComponentProps } from "react";
import ButtonSpinner from "./ButtonSpinner";

interface Props extends ComponentProps<"button"> {
  isLoading: boolean;
  children: string;
  className: string;
}

function LoadingButton({ isLoading, children, className, ...rest }: Props) {
  return (
    <button className={`${className} relative`} {...rest}>
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <ButtonSpinner />
        </span>
      )}
      <span className={isLoading ? "invisible" : ""}>{children}</span>
    </button>
  );
}

// group rounded px-5 py-2 font-medium text-black focus-visible:outline
export default LoadingButton;
