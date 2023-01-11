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
        "focus:outline-none",
        "border border-transparent px-2 py-1",
        "focus:border-gray-400/50 dark:focus:border-gray-200/30",
        "hover:border-gray-400/20 dark:hover:border-gray-200/10"
      )}
      html={children}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value, (e.target as any).cleaned)}
    />
  );
}
