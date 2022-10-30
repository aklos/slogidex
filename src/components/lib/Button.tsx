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
      className={cx(
        "cursor-pointer relative group h-full flex items-center",
        className,
        {}
      )}
      onClick={onClick}
      onMouseDown={() => toggleMouseDown(true)}
      onMouseUp={() => toggleMouseDown(false)}
      onMouseLeave={() => toggleMouseDown(false)}
    >
      <div className="flex items-center">
        {!!Icon ? <Icon className={cx({ "mr-2": !!label })} /> : null}
        {label ? <div className={cx({ "pr-1": !!Icon })}>{label}</div> : null}
      </div>
    </button>
  );
}
