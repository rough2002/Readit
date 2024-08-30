import { ChangeEventHandler, ComponentProps } from "react";
import { Input } from "./ui/input";

interface Props extends ComponentProps<"input"> {
  searchTerm: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

function InputSearch({ searchTerm, onChange, ...props }: Readonly<Props>) {
  return (
    <Input type="text" value={searchTerm} onChange={onChange} {...props} />
  );
}

export default InputSearch;
