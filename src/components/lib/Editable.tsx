import * as React from "react";
import ContentEditable from "react-contenteditable";
import cx from "classnames";

export default function Editable(props: {
  children: any;
  onChange: (value: string) => void;
}) {
  const { children, onChange } = props;

  return (
    <ContentEditable
      className={cx(
        "border border-transparent px-2 py-1",
        "focus:border-gray-200/30",
        "hover:border-gray-200/30"
      )}
      html={children}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
