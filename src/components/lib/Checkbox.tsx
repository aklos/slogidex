import React from "react";
import cx from "classnames";
import * as Icon from "react-bootstrap-icons";

type Props = {
  checked: boolean;
  onChange?: () => void;
};

export default function Checkbox(props: Props) {
  const { checked, onChange } = props;
  return (
    <label className="cursor-pointer">
      {checked ? <Icon.CheckSquareFill /> : <Icon.Square />}
      <input
        type="checkbox"
        className="hidden"
        checked={checked}
        onChange={onChange}
      />
    </label>
  );
}
