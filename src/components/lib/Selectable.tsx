import React from "react";
import cx from "classnames";

export default function Selectable(props: {
  className?: string;
  children: any;
  onClick?: () => void;
}) {
  const [hovering, toggleHovering] = React.useState(false);

  return (
    <span
      className={cx("relative", props.className)}
      onMouseOver={() => toggleHovering(true)}
      onMouseLeave={() => toggleHovering(false)}
      onClick={props.onClick}
    >
      <span
        className={cx(
          "absolute font-mono transform -translate-x-full opacity-30",
          {
            hidden: !hovering,
            "inline-block": hovering,
          }
        )}
      >
        [
      </span>
      {props.children}
      <span
        className={cx("absolute font-mono opacity-30", {
          hidden: !hovering,
          "inline-block": hovering,
        })}
      >
        ]
      </span>
    </span>
  );
}
