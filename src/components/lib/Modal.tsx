import * as React from "react";
import Button from "./Button";
import { XIcon } from "./icons";

export default function Modal(props) {
  const { children, onClose } = props;
  return (
    <div className="absolute z-30 transform -translate-y-1/2 -translate-x-1/2 px-4 pt-8 pb-4 bg-white rounded-md border border-gray-300 drop-shadow-md">
      <div className="absolute top-0 right-0 p-2">
        <Button small icon={XIcon} onClick={onClose} />
      </div>
      {children}
    </div>
  );
}
