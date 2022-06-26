import * as React from "react";
import cx from "classnames";
import Button from "./Button";
import {
  HeadingIcon,
  BoldIcon,
  ItalicIcon,
  CodeIcon,
  LinkIcon,
  PhotoIcon,
  IndentIcon,
  NumberedListIcon,
  ListIcon,
  LockOpenIcon,
} from "./Icons";
import ReactMarkdown from "react-markdown";
import ToolBar, { ToolBarButton } from "./ToolBar";

type Props = {
  id: string;
  index: number;
  value: string;
  selected: boolean;
  updateSection: (id: string, value: string) => void;
  removeSection: (id: string) => void;
  moveSection: (id: string, direction: 1 | -1) => void;
  toggleLockSection: (id: string) => void;
};

export default function Markdown(props) {
  const {
    id,
    index,
    value,
    selected,
    locked,
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
    <div className="relative bg-white border" ref={containerRef}>
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
        removeSection={index !== 0 ? () => removeSection(id) : undefined}
        moveSectionUp={() => moveSection(id, -1)}
        moveSectionDown={() => moveSection(id, 1)}
        toggleLockSection={() => toggleLockSection(id)}
      >
        <ToolBarButton icon={HeadingIcon} className="mr-4" />
        <ToolBarButton icon={BoldIcon} className="mr-4" />
        <ToolBarButton icon={ItalicIcon} className="mr-4" />
        <ToolBarButton icon={CodeIcon} className="mr-4" />
        <ToolBarButton icon={LinkIcon} className="mr-4" />
        <ToolBarButton icon={PhotoIcon} className="mr-4" />
        <ToolBarButton icon={IndentIcon} className="mr-4" />
        <ToolBarButton icon={NumberedListIcon} className="mr-4" />
        <ToolBarButton icon={ListIcon} />
      </ToolBar>
      <div className="w-full flex">
        <div
          ref={editorRef}
          className={cx(
            "w-full px-8 py-12 flex-shrink-0 font-mono focus:outline-none",
            {
              hidden: !selected,
            }
          )}
          contentEditable
          onInput={(e) => {
            const rawHTML = e.currentTarget.innerHTML;
            const cleanedText = rawHTML
              .replace(/(?:\r\<br\>|\r|\<br\>)/g, "\n")
              .replace(/(\<([^\>]+)\>)/gi, "\n");

            updateSection(id, cleanedText);
          }}
        ></div>
        <div
          className={cx("px-8 py-12 flex-shrink-0 prose max-w-none", {
            hidden: selected,
            "w-full": !selected,
          })}
        >
          <ReactMarkdown children={value} />
        </div>
      </div>
    </div>
  );
}
