import toast from "react-hot-toast";
import { BiSolidError } from "react-icons/bi";
import { RxCross1 } from "react-icons/rx";

const showErrorToast = (message: string) => {
  toast.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-md w-full bg-red-500 shadow-lg items-center rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 justify-around`}
    >
      <BiSolidError fill="white" />
      <p className="text-white">{message}</p>
      <button onClick={() => toast.dismiss(t.id)}>
        <RxCross1 className="text-white fill-white" />
      </button>
    </div>
  ));
};

export default showErrorToast;
