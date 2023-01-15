import React from "react";
import cx from "classnames";
import { Icon } from "react-bootstrap-icons";

interface Props {
  Icon: Icon;
  label?: string;
  title?: string;
  disabled?: boolean;
  positive?: boolean;
  destructive?: boolean;
  onClick: () => void;
}

export default function Button(props: Props) {
  const { Icon, label, title, disabled, positive, destructive, onClick } =
    props;
  return (
    <button
      className={cx(
        "p-2 flex items-center transition duration-100",
        "hover:bg-black/10 dark:hover:bg-black/30",
        {
          "opacity-20 pointer-events-none": disabled,
          "text-lime-500 dark:text-lime-400": positive,
          "text-red-500 dark:text-red-400": destructive,
        }
      )}
      title={title}
      onClick={
        disabled
          ? undefined
          : (e) => {
              e.stopPropagation();
              onClick();
            }
      }
    >
      {Icon ? <Icon /> : null}
      {label ? (
        <span className={cx({ "ml-1.5 text-sm": !!Icon })}>{label}</span>
      ) : null}
    </button>
  );
}
