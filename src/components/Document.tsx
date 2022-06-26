import * as React from "react";
import cx from "classnames";
import { v4 as uuidv4 } from "uuid";
import Button from "./lib/Button";
import Script from "./lib/Script";
import Markdown from "./lib/Markdown";
import { CodeIcon, MarkdownIcon, PlugConnectIcon, PlusIcon } from "./lib/Icons";

type SectionType = "script" | "markdown" | "link";

type Section = {
  id: string;
  type: SectionType;
  value: string;
  selected: boolean;
  locked: boolean;
};

export default function Document() {
  const doc = window.localStorage.getItem("doc");
  const [sections, setSections] = React.useState<Section[]>(
    doc
      ? JSON.parse(doc)
      : [
          {
            id: uuidv4(),
            type: "markdown",
            value: "",
            selected: true,
            locked: false,
          },
        ]
  );

  React.useEffect(() => {
    window.localStorage.setItem("doc", JSON.stringify(sections));
  }, [sections]);

  const handleDocumentClick = (e) => {
    if (!e.target.closest(".document")) {
      // Clear any selection
      const _sections = Array.from(sections).map((s) =>
        Object.assign(s, { selected: false })
      );

      setSections(_sections);
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  });

  const selectSection = (id: string) => {
    // Immediately clear selected on assignment
    const _sections = Array.from(sections).map((s) =>
      Object.assign(s, { selected: false })
    );
    const sectionIndex = _sections.findIndex((s) => s.id === id);

    _sections[sectionIndex].selected = true;

    setSections(_sections);
  };

  const insertSection = (index: number, sectionType: SectionType) => {
    // Immediately clear selected on assignment
    const _sections = Array.from(sections).map((s) =>
      Object.assign(s, { selected: false })
    );

    _sections.splice(index + 1, 0, {
      id: uuidv4(),
      type: sectionType,
      value: "",
      selected: true,
      locked: false,
    });

    setSections(_sections);
  };

  function removeSection(id: string) {
    const _sections = Array.from(sections);
    const sectionIndex = _sections.findIndex((s) => s.id === id);

    _sections.splice(sectionIndex, 1);

    setSections(_sections);
  }

  const updateSection = (id: string, value: string) => {
    const _sections = Array.from(sections);
    const sectionIndex = _sections.findIndex((s) => s.id === id);

    _sections[sectionIndex].value = value;

    setSections(_sections);
  };

  const moveSection = (id: string, direction: 1 | -1) => {
    const _sections = Array.from(sections);
    const sectionIndex = _sections.findIndex((s) => s.id === id);

    // Move the section up or down, according to direction
    const element = _sections[sectionIndex];
    _sections.splice(sectionIndex, 1);
    _sections.splice(sectionIndex + direction, 0, element);

    setSections(_sections);
  };

  const toggleLockSection = (id: string) => {
    const _sections = Array.from(sections);
    const sectionIndex = _sections.findIndex((s) => s.id === id);

    const locked = _sections[sectionIndex].locked;
    _sections[sectionIndex].locked = !locked;
    _sections[sectionIndex].selected = false;

    setSections(_sections);
  };

  return (
    <div className="document p-8">
      <div className="flex items-center mb-16">
        <Button icon={PlugConnectIcon} label="Connect to client" />
      </div>
      <ul className="list-none">
        {sections.map((s, index) => (
          <div key={`section_${s.id}`} className="relative">
            <Section
              index={index}
              {...s}
              selectSection={selectSection}
              updateSection={updateSection}
              removeSection={removeSection}
              moveSection={moveSection}
              toggleLockSection={toggleLockSection}
            />
            <SectionInserter index={index} insertSection={insertSection} />
          </div>
        ))}
      </ul>
    </div>
  );
}

function Section(props) {
  const {
    index,
    id,
    type,
    value,
    selected,
    locked,
    selectSection,
    updateSection,
    removeSection,
    moveSection,
    toggleLockSection,
  } = props;
  const [hovering, setHovering] = React.useState(false);

  return (
    <li
      style={{ marginBottom: "32px" }}
      className={cx("flex", { "cursor-pointer": !selected && !locked })}
      onClick={!selected && !locked ? () => selectSection(id) : undefined}
      onMouseOver={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* <div
        className={cx("border-l-2 flex-shrink-0", {
          "border-transparent": !selected && !hovering,
          "border-gray-900": !selected && hovering,
          "border-blue-600": selected,
        })}
      ></div> */}
      <div className="w-full">
        {type === "markdown" ? (
          <Markdown
            id={id}
            index={index}
            value={value}
            locked={locked}
            selected={selected}
            updateSection={updateSection}
            removeSection={removeSection}
            moveSection={moveSection}
            toggleLockSection={toggleLockSection}
          />
        ) : (
          <Script
            id={id}
            index={index}
            value={value}
            locked={locked}
            selected={selected}
            updateSection={updateSection}
            removeSection={removeSection}
            moveSection={moveSection}
            toggleLockSection={toggleLockSection}
          />
        )}
      </div>
    </li>
  );
}

function SectionInserter(props) {
  const { index, insertSection } = props;
  const [hovering, setHovering] = React.useState(false);
  const [innerHovering, setInnerHovering] = React.useState(false);

  return (
    <div
      className={cx(
        "absolute z-10 w-full top-full h-4 flex items-center transform -translate-y-1/2",
        {
          "opacity-0": !hovering,
        }
      )}
      onMouseOver={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div
        className={cx("w-full relative border-b border-gray-900")}
        onMouseOver={() => setInnerHovering(true)}
        onMouseLeave={() => setInnerHovering(false)}
      >
        {innerHovering ? (
          <div className="flex items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="mr-2 bg-white border rounded-full">
              <Button
                size="small"
                icon={MarkdownIcon}
                label="Markdown"
                onClick={() => insertSection(index, "markdown")}
              />
            </div>
            <div className="bg-white border rounded-full">
              <Button
                size="small"
                icon={CodeIcon}
                label="Script"
                onClick={() => insertSection(index, "script")}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 bg-white rounded-full">{PlusIcon}</div>
          </div>
        )}
      </div>
    </div>
  );
}
