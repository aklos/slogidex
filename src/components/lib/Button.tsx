import React from "react";
import cx from "classnames";
import { Icon } from "react-bootstrap-icons";

interface Props {
  Icon: Icon;
  label?: string;
  title?: string;
  onClick: () => void;
}

export default function Button(props: Props) {
  const { Icon, label, title, onClick } = props;
  return (
    <button
      className={cx("p-2 flex items-center")}
      title={title}
      onClick={onClick}
    >
      {Icon ? <Icon /> : null}
      {label ? (
        <span className={cx({ "ml-1.5 text-sm": !!Icon })}>{label}</span>
      ) : null}
    </button>
  );
}
