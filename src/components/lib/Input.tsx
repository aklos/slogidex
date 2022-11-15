import * as React from "react";
import * as Icons from "react-bootstrap-icons";
import cx from "classnames";
import Button from "./Button";

interface Props {
  value: string;
  onChange: (v: string) => void;
  Icon?: Icons.Icon;
  placeholder?: string;
}

export default function Input(props: Props) {
  const { value, onChange, Icon, placeholder } = props;

  return (
    <label className="w-full">
      <div
        className={cx(
          "border rounded-sm",
          "pl-2 relative flex items-center",
          "bg-white dark:bg-black dark:border-black overflow-hidden"
        )}
      >
        {Icon && !value ? (
          <div className="mr-2">
            <Icon />
          </div>
        ) : null}
        <input
          className="w-full py-1 flex-grow focus:outline-none bg-inherit"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
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
