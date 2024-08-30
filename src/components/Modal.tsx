"use client";
import React, {
  cloneElement,
  createContext,
  useContext,
  useState,
  ReactNode,
  RefObject,
  ReactElement,
} from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import { useOutsideClick } from "@/hooks/useOutsideClick";

interface ModalContextType {
  openName: string;
  close: () => void;
  open: (name: string) => void;
}

interface ModalProps {
  children: ReactNode;
}

interface OpenProps {
  children: ReactElement;
  opens: string;
}

interface WindowProps {
  children: ReactElement;
  name: string;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

const Modal = ({ children }: { children: ReactNode }) => {
  const [openName, setOpenName] = useState("");

  const close = () => setOpenName("");
  const open = setOpenName;

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
};

const Open: React.FC<OpenProps> = ({ children, opens: opensWindowName }) => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("Open must be used within a Modal");
  }
  const { open } = context;

  return cloneElement(children, { onClick: () => open(opensWindowName) });
};

const Window: React.FC<WindowProps> = ({ children, name }) => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("Window must be used within a Modal");
  }
  const { openName, close } = context;
  const ref: RefObject<HTMLDivElement> = useOutsideClick(close);

  if (name !== openName) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-500">
      <div
        ref={ref}
        className="relative bg-white rounded-lg shadow-lg p-8 transition-all duration-500"
      >
        <button
          onClick={close}
          className="absolute top-4 right-4 p-2 rounded hover:bg-gray-100 transition-colors"
        >
          <HiXMark className="w-6 h-6 text-gray-500" />
        </button>
        <div>{cloneElement(children, { onCloseModal: close })}</div>
      </div>
    </div>,
    document.body
  );
};

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
