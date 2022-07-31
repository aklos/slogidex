import React from "react";
import cx from "classnames";
import { Link } from "react-router-dom";
import { Icon } from "react-bootstrap-icons";

type Props = {
  Icon?: Icon;
  loose?: boolean;
  callToAction?: boolean;
  positive?: boolean;
  negative?: boolean;
  label?: string;
  submit?: boolean;
  link?: boolean;
  to?: string;
  active?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
};

export default function Button(props: Props) {
  const {
    link,
    to,
    loose,
    callToAction,
    positive,
    negative,
    className,
    submit,
    Icon,
    label,
    active,
    disabled,
    onClick,
  } = props;
  const [mouseDown, toggleMouseDown] = React.useState(false);

  return (
    <button
      type={submit ? "submit" : "button"}
      disabled={disabled || false}
      className={cx("relative group h-full flex items-center", className, {
        "w-full": !loose,
        "w-auto px-2 py-1 border border-gray-400 rounded-sm": loose,
        "drop-shadow-md": !disabled && loose,
        "bg-white": !callToAction && !positive && !negative,
        "bg-blue-500 text-gray-100": callToAction,
        "bg-green-500 text-gray-100": positive,
        "bg-red-500 text-gray-100": negative,
        "border-b-2 border-transparent": link,
        "border-gray-900 pointer-events-none": active,
      })}
      onClick={onClick}
      onMouseDown={() => toggleMouseDown(true)}
      onMouseUp={() => toggleMouseDown(false)}
      onMouseLeave={() => toggleMouseDown(false)}
    >
      {!link ? (
        <div
          className={cx(
            "pointer-events-none absolute left-0 top-0 w-full h-full",
            "mix-blend-multiply",
            {
              "bg-gray-100": disabled,
              "group-hover:bg-gradient-to-b from-white group-hover:to-gray-100":
                !disabled,
              "group-hover:to-gray-200": !disabled && mouseDown,
            }
          )}
        ></div>
      ) : null}
      <div>
        {link && to ? (
          <Link to={to} className="flex items-center">
            {!!Icon ? <Icon className={cx({ "mr-2": !!label })} /> : null}
            {label ? (
              <div className={cx({ "pr-1": !!Icon })}>{label}</div>
            ) : null}
          </Link>
        ) : (
          <div className="flex items-center">
            {!!Icon ? <Icon className={cx({ "mr-2": !!label })} /> : null}
            {label ? (
              <div className={cx({ "pr-1": !!Icon })}>{label}</div>
            ) : null}
          </div>
        )}
      </div>
    </button>
  );
}
