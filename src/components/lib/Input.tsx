import * as React from "react";
import * as Icons from "react-bootstrap-icons";
import cx from "classnames";
import Button from "./Button";

interface Props {
  Icon?: Icons.Icon;
  value: string;
  onChange: (v: string) => void;
}

export default function Input(props: Props) {
  const { Icon, value, onChange } = props;

  return (
    <label className="w-full">
      <div
        className={cx(
          "dark:border-black border rounded-sm overflow-hidden",
          "pl-2 relative flex items-center bg-white dark:bg-black"
        )}
      >
        {Icon && !value ? (
          <div className="mr-2">
            <Icon />
          </div>
        ) : null}
        <input
          className="w-full py-1 flex-grow focus:outline-none dark:bg-black"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {value ? (
          <div>
            <Button Icon={Icons.BackspaceFill} onClick={() => onChange("")} />
          </div>
        ) : null}
      </div>
    </label>
  );
}
