import React from "react";
import * as Icons from "react-bootstrap-icons";
import cx from "classnames";

export default function Select(props: {
  value: string;
  onChange: (v: string) => void;
  options: Types.Option[];
  placeholder?: string;
  label?: any;
  large?: boolean;
}) {
  const { value, onChange, label, placeholder, options, large } = props;
  const [toggled, setToggled] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const ref = React.useRef(null);

  const handleWindowClick = (e: any) => {
    if (ref.current && !(ref.current as any).contains(e.target)) {
      setToggled(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleWindowClick);
    return () => {
      document.removeEventListener("mousedown", handleWindowClick);
    };
  }, []);

  const selectedOption = options.find((o) => o.value === value) || {
    value: "",
    label: placeholder,
  };

  const selectOption = React.useCallback(
    (value: string) => {
      onChange(value);
      setToggled(false);
    },
    [value]
  );

  return (
    <label ref={ref}>
      <input
        type="text"
        className="hidden"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {label ? (
        <div
          className={cx("font-bold", {
            "mb-0.5": !large,
            "mb-1 text-base": large,
          })}
        >
          {label}
        </div>
      ) : null}
      <div
        style={{ minHeight: "30px" }}
        className={cx(
          "w-full pl-2 pr-1",
          "flex items-center justify-between",
          "border rounded-sm bg-white dark:bg-black/40",
          {
            "py-1": !large,
            "py-1.5 text-base": large,
            "border-gray-300 dark:border-black/20": !focused,
            "border-gray-400 dark:border-gray-400/30": focused,
          }
        )}
        onMouseDown={() => {
          setToggled(!toggled);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        <div
          className={cx({
            "opacity-20 dark:opacity-50 italic": !value,
          })}
        >
          {selectedOption.label}
        </div>
        <div>
          <Icons.CaretDown />
        </div>
      </div>
      <div className="relative w-full">
        <div
          className={cx(
            "overflow-hidden absolute bg-gray-200 dark:bg-black w-full z-10",
            "bottom-0 left-0 transform translate-y-full",
            {
              hidden: !toggled,
            }
          )}
        >
          {placeholder ? (
            <Option
              value=""
              label={placeholder}
              onClick={() => selectOption("")}
              placeholder
              large={large}
            />
          ) : null}
          {options.map((o) => (
            <Option
              key={o.value}
              value={o.value}
              label={o.label}
              onClick={() => selectOption(o.value)}
              large={large}
            />
          ))}
        </div>
      </div>
    </label>
  );
}

function Option(props: {
  value: string;
  label: string;
  onClick: () => void;
  selected?: boolean;
  large?: boolean;
  placeholder?: boolean;
}) {
  const { value, label, onClick, selected, placeholder, large } = props;
  return (
    <div
      className={cx("px-2 hover:bg-white/10", {
        "py-1": !large,
        "py-1.5 text-base": large,
      })}
      onClick={onClick}
    >
      <span className={cx({ "opacity-60 italic": placeholder })}>{label}</span>
    </div>
  );
}
