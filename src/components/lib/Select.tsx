import React from "react";
import * as Icons from "react-bootstrap-icons";
import cx from "classnames";

export default function Select(props: {
  value: string;
  onChange: (v: string) => void;
  options: Types.Option[];
  placeholder?: string;
  label?: any;
}) {
  const { value, onChange, label, placeholder, options } = props;
  const [toggled, setToggled] = React.useState(false);
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
      {label ? <div className="mb-0.5 font-bold">{label}</div> : null}
      <div
        style={{ minHeight: "30px" }}
        className={cx(
          "w-full px-2 py-1",
          "flex items-center justify-between",
          "border rounded-sm dark:bg-black dark:border-black"
        )}
        onMouseDown={() => {
          setToggled(!toggled);
        }}
      >
        <div>{selectedOption.label}</div>
        <div>
          <Icons.CaretDown />
        </div>
      </div>
      <div className="relative w-full">
        <div
          className={cx(
            "overflow-hidden absolute dark:bg-black w-full z-10",
            "border-t",
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
            />
          ) : null}
          {options.map((o) => (
            <Option
              key={o.value}
              value={o.value}
              label={o.label}
              onClick={() => selectOption(o.value)}
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
}) {
  const { value, label, onClick, selected } = props;
  return (
    <div className="px-2 py-1" onClick={onClick}>
      {label}
    </div>
  );
}
