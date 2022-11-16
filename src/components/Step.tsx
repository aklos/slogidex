import * as React from "react";
import * as Icons from "react-bootstrap-icons";
import cx from "classnames";
import Button from "./lib/Button";
import Markdown from "./editors/Markdown";
import Script from "./editors/Script";

export default function Step(props: {
  data: Types.Step;
  updateContent: (content: string) => void;
  toggleRequired: () => void;
  deleteStep: () => void;
}) {
  const { data, updateContent, toggleRequired, deleteStep } = props;

  const editorComponentMap = React.useCallback(() => {
    switch (data.type) {
      case "form":
        return null;
      case "markdown":
        return (
          <Markdown
            data={data}
            update={(value: string) => updateContent(value)}
          />
        );
      case "script":
        return (
          <Script
            data={data}
            update={(value: string) => updateContent(value)}
          />
        );
    }
  }, [data.type]);

  return (
    <div className={cx("group/step relative")}>
      <div className="absolute z-10 right-0 text-xs bg-gray-400/20 flex opacity-0 group-hover/step:opacity-100 transition duration-200">
        <Button
          Icon={data.required ? Icons.CheckSquareFill : Icons.CheckSquare}
          onClick={toggleRequired}
        />
        <Button Icon={Icons.ArrowUp} />
        <Button Icon={Icons.ArrowDown} />
        <Button style="negative" Icon={Icons.Trash3Fill} onClick={deleteStep} />
      </div>
      <div
        className={cx(
          "w-full border border-transparent group-hover/step:border-gray-400/20 transition duration-200",
          {
            flex: data.required,
          }
        )}
      >
        {data.required ? (
          <div className="flex-shrink-0 border-r-2 border-gray-400/20">
            <Button
              Icon={
                data.type === "script" ? Icons.CaretRightSquare : Icons.Square
              }
            />
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
