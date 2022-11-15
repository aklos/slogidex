import * as React from "react";
import * as Icons from "react-bootstrap-icons";
import cx from "classnames";
import Button from "./lib/Button";
import Markdown from "./editors/Markdown";
import Script from "./editors/Script";

export default function Step(props: {
  data: Types.Step;
  toggleStepRequired: () => void;
  deleteStep: () => void;
}) {
  const { data, toggleStepRequired, deleteStep } = props;

  const editorComponentMap = React.useCallback(() => {
    switch (data.type) {
      case "form":
        return null;
      case "markdown":
        return <Markdown data={data} />;
      case "script":
        return <Script data={data} />;
    }
  }, [data.type]);

  return (
    <div className={cx("group/step relative")}>
      <div className="text-xs bg-gray-200/20 flex justify-end opacity-0 group-hover/step:opacity-100 transition duration-200">
        <Button
          Icon={data.required ? Icons.CheckSquareFill : Icons.CheckSquare}
          onClick={toggleStepRequired}
        />
        <Button Icon={Icons.ArrowUp} />
        <Button Icon={Icons.ArrowDown} />
        <Button style="negative" Icon={Icons.Trash3Fill} onClick={deleteStep} />
      </div>
      <div
        className={cx(
          "w-full border border-transparent group-hover/step:border-gray-200/20 transition duration-200",
          {
            flex: data.required,
          }
        )}
      >
        {data.required ? (
          <div className="flex-shrink-0 border-r-2 border-gray-200/20">
            <Button Icon={Icons.Square} />
          </div>
        ) : null}
        <div
          className={cx("w-full", {
            "": data.required,
          })}
        >
          {editorComponentMap()}
        </div>
      </div>
    </div>
  );
}
