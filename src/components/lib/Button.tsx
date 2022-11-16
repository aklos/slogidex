import * as React from "react";
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
}

export default function Button(props: Props) {
  const { Icon, onClick, style, title, label, border, underline } = props;

  return (
    <button
      className={cx(
        "h-[28px] py-1 flex items-center hover:bg-black/10 hover:dark:bg-white/10",
        {
          "px-2": label,
          "px-1.5": !label,
          "text-lime-400": style === "positive",
          "text-rose-400": style === "negative",
          border: border,
          "underline underline-offset-1": underline,
        }
      )}
      title={title}
      onClick={onClick}
    >
      {Icon ? <Icon /> : null}
      {label ? <span className="px-2">{label}</span> : null}
    </button>
  );
}
