import * as React from "react";
import * as Icons from "react-bootstrap-icons";
import cx from "classnames";

interface Props {
  Icon?: Icons.Icon;
  style?: "normal" | "positive" | "negative";
  label?: string;
  title?: string;
  onClick?: () => void;
}

export default function Button(props: Props) {
  const { Icon, style, title, label, onClick } = props;

  return (
    <button
      className={cx("h-[28px] px-2 py-1 flex items-center", {
        "bg-lime-500": style === "positive",
      })}
      title={title}
      onClick={onClick}
    >
      {Icon ? <Icon /> : null}
      {label ? <span className="px-2">{label}</span> : null}
    </button>
  );
}
