import React from "react";
import * as Icons from "react-bootstrap-icons";
import cx from "classnames";

interface Props {
  Icon?: Icons.Icon;
  onClick?: () => void;
  style?: "normal" | "positive" | "negative";
  label?: string;
  title?: string;
  border?: boolean;
  underline?: boolean;
  disabled?: boolean;
  large?: boolean;
}

export default function Button(props: Props) {
  const {
    Icon,
    onClick,
    style,
    title,
    label,
    border,
    underline,
    disabled,
    large,
  } = props;

  return (
    <button
      className={cx(
        "flex items-center hover:bg-black/10 hover:dark:bg-white/10 rounded-sm",
        {
          "py-1 h-[28px]": !large,
          "py-1.5 h-[36px]": large,
          "px-2": label,
          "px-1.5": !label,
          "text-lime-400": style === "positive",
          "text-rose-400": style === "negative",
          "border border-gray-400": border,
          "underline underline-offset-1": underline,
          "opacity-50 pointer-events-none": disabled,
        }
      )}
      title={title}
      onClick={onClick}
      disabled={disabled}
    >
      {Icon ? <Icon /> : null}
      {label ? (
        <span className={cx("pl-2", { "pr-2": !Icon, "pr-1": Icon })}>
          {label}
        </span>
      ) : null}
    </button>
  );
}
