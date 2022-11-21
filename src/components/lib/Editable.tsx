import * as React from "react";
import ContentEditable from "react-contenteditable";
import cx from "classnames";

export default function Editable(props: {
  children: any;
  className?: string;
  placeholder?: string;
  onChange: (html: string, text: string) => void;
}) {
  const { children, className, placeholder, onChange } = props;

  return (
    <ContentEditable
      className={cx(
        className,
        "border border-transparent px-2 py-1",
        "focus:border-gray-200/30",
        "hover:border-gray-200/30"
      )}
      html={children}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value, (e.target as any).cleaned)}
    />
  );
}
