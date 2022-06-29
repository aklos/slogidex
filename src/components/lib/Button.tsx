import * as React from "react";
import cx from "classnames";

export default function Button(props) {
  const { className, type, small, icon, label, hint, onClick } = props;

  return (
    <button
      type={type || "button"}
      className={cx(className, "flex items-center")}
      title={hint}
      onClick={onClick}
    >
      {!!icon ? (
        <div
          className={cx("flex-shrink-0", {
            "mr-2": !!label,
            "w-5 h-5": !small,
            "w-4 h-4": small,
          })}
        >
          {icon}
        </div>
      ) : null}
      {!!label ? (
        <div
          className={cx("w-full text-center", { "text-sm mt-1 mr-1": small })}
        >
          {label}
        </div>
      ) : null}
    </button>
  );
}
