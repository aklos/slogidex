import * as React from "react";
import cx from "classnames";

export default function Button(props) {
  const { size, active, disabled, label, icon, onClick } = props;

  return (
    <button
      className={cx("flex items-center font-bold", "py-1", {
        "px-4": label && !icon,
        "pl-3 pr-4": label && !!icon,
        "text-blue-300": active,
        "opacity-20": disabled,
      })}
      disabled={disabled || active}
      onClick={onClick}
    >
      {icon ? (
        <div
          className={cx({
            "w-4 h-4": size === "small",
            "w-6 h-6": !size,
            "mr-2": !!label,
          })}
        >
          {icon}
        </div>
      ) : null}
      {label ? (
        <div
          className={cx("leading-none", {
            "text-sm mt-1": size === "small",
          })}
        >
          {label}
        </div>
      ) : null}
    </button>
  );
}
