import React from "react";
import cx from "classnames";
import Button from "./Button";
import * as Icon from "react-bootstrap-icons";

type Props = {
  children?: any;
  onClose: () => void;
};

export default function Modal(props: Props) {
  return (
    // <div className="fixed z-10 w-screen h-screen top-0 left-0 bg-black/50">
    <div
      className={cx(
        "absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
        "w-80 bg-white drop-shadow-lg border"
      )}
    >
      <div className="flex justify-end">
        <Button Icon={Icon.X} className="p-2 w-auto" onClick={props.onClose} />
      </div>
      <div>{props.children}</div>
    </div>
    // </div>
  );
}
