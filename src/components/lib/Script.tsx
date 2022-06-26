import * as React from "react";
import cx from "classnames";
import { LockOpenIcon, PlayIcon } from "./Icons";
import ToolBar, { ToolBarButton } from "./ToolBar";
import Button from "./Button";

export default function Script(props) {
  const {
    id,
    value,
    locked,
    selected,
    updateSection,
    removeSection,
    moveSection,
    toggleLockSection,
  } = props;
  const containerRef = React.useRef(null);
  const editorRef = React.useRef(null);

  React.useEffect(() => {
    if (editorRef.current && value) {
      const editor: HTMLDivElement = editorRef.current;
      if (editor.innerHTML === "") {
        editor.innerHTML = value.replace(/\n/g, "<br />");
      }
    }
  }, [editorRef.current]);

  return (
    <div className="bg-gray-100 border" ref={containerRef}>
      {!!locked ? (
        <div
          style={{ height: "32px" }}
          className="w-full px-4 py-1 absolute transform -translate-y-full flex justify-end"
        >
          <ToolBarButton
            icon={LockOpenIcon}
            onClick={() => toggleLockSection(id)}
          />
        </div>
      ) : null}
      <ToolBar
        show={selected}
        containerRef={containerRef}
        removeSection={() => removeSection(id)}
        moveSectionUp={() => moveSection(id, -1)}
        moveSectionDown={() => moveSection(id, 1)}
        toggleLockSection={() => toggleLockSection(id)}
      ></ToolBar>
      <div className="flex">
        {!selected ? (
          <div className="flex-shrink-0 p-2 bg-white border-r flex justify-center items-center">
            <div className="w-0 h-0 flex justify-center items-center p-3 border bg-gray-900 text-gray-100 rounded-full">
              <Button size="small" icon={PlayIcon} />
            </div>
          </div>
        ) : null}
        <pre
          className={cx("w-full h-full p-4 font-mono focus:outline-none", {
            "max-h-72 overflow-auto": !selected,
          })}
        >
          <code
            ref={editorRef}
            className="focus:outline-none"
            contentEditable={!locked && selected}
            onInput={(e) => {
              const rawHTML = e.currentTarget.innerHTML;
              const cleanedText = rawHTML
                .replace(/(?:\r\<br\>|\r|\<br\>)/g, "\n")
                .replace(/(\<([^\>]+)\>)/gi, "\n");

              updateSection(id, cleanedText);
            }}
          ></code>
        </pre>
      </div>
    </div>
  );
}
