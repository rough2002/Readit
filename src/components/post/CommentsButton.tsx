import { GoComment } from "react-icons/go";

interface Props {
  totalComments: number;
}
function CommentsButton({ totalComments }: Props) {
  return (
    <button className="flex space-x-2 items-center justify-center border rounded-xl p-1">
      <GoComment size={24} /> <span>{totalComments}</span>
    </button>
  );
}

export default CommentsButton;
