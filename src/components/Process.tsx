import * as React from "react";
import cx from "classnames";
import { v4 as uuidv4 } from "uuid";
import Button from "./lib/Button";
import {
  CodeIcon,
  FormIcon,
  MarkdownIcon,
  PlugIcon,
  PlugXIcon,
} from "./lib/icons";
import Section from "./Section";
import { FormField, InputType } from "./FormEditor";

type SectionType = "script" | "markdown" | "form";
type SectionStatus = "initial" | "in-progress" | "completed";

type Section = {
  id: string;
  step: boolean;
  type: SectionType;
  value: string | FormField[];
  status: "initial" | "in-progress" | "completed";
  output?: string;
  args?: FormField[];
};

export default function Process() {
  const doc = window.localStorage.getItem("doc");
  const [connected, toggleConnection] = React.useState(false);
  const [sections, setSections] = React.useState<Section[]>(
    doc
      ? JSON.parse(doc)
      : [
          {
            id: uuidv4(),
            type: "markdown",
            value: "",
            step: false,
            status: "initial",
          },
        ]
  );

  React.useEffect(() => {
    window.localStorage.setItem("doc", JSON.stringify(sections));
  }, [sections]);

  const updateSection = React.useCallback(
    (id: string, value: string | FormField[]) => {
      const _sections = Array.from(sections);
      const index = _sections.findIndex((s) => s.id === id);

      _sections[index].value = value;

      setSections(_sections);
    },
    [sections]
  );

  const deleteSection = React.useCallback(
    (id: string) => {
      const _sections = Array.from(sections);
      const index = _sections.findIndex((s) => s.id === id);

      _sections.splice(index, 1);

      setSections(_sections);
    },
    [sections]
  );

  const moveSection = React.useCallback(
    (id: string, dir: 1 | -1) => {
      const _sections = Array.from(sections);
      const index = _sections.findIndex((s) => s.id === id);
      const element = _sections[index];

      _sections.splice(index, 1);
      _sections.splice(index + dir, 0, element);

      setSections(_sections);
    },
    [sections]
  );

  const insertSection = React.useCallback(
    (id: string, type: SectionType) => {
      const _sections = Array.from(sections);
      const index = _sections.findIndex((s) => s.id === id);

      _sections.splice(index + 1, 0, {
        id: uuidv4(),
        type,
        step: type === "script",
        value: type === "script" ? `#!/bin/bash` : type === "form" ? [] : "",
        status: "initial",
      });

      setSections(_sections);
    },
    [sections]
  );

  const setSectionStatus = React.useCallback(
    (id: string, status: SectionStatus) => {
      const _sections = Array.from(sections);
      const index = _sections.findIndex((s) => s.id === id);

      _sections[index].status = status;

      setSections(_sections);
    },
    [sections]
  );

  const toggleStep = React.useCallback((id: string) => {
    const _sections = Array.from(sections);
    const index = _sections.findIndex((s) => s.id === id);

    _sections[index].step = !_sections[index].step;

    setSections(_sections);
  }, []);

  const addArgument = React.useCallback(
    (id: string, fieldId: string) => {
      const fields = sections
        .filter((s) => s.type === "form")
        .reduce((accu: FormField[], curr) => {
          return accu.concat(curr.value as FormField[]);
        }, []);
      const field = fields.find((f) => f.id === fieldId);

      if (field) {
        const _sections = Array.from(sections);
        const index = _sections.findIndex((s) => s.id === id);

        if (_sections[index].args) {
          (_sections[index].args as any).push(field);
        } else {
          _sections[index].args = [field];
        }

        setSections(_sections);
      }
    },
    [sections]
  );
  const deleteArgument = React.useCallback(
    (id: string, fieldId: string) => {
      const _sections = Array.from(sections);
      const index = _sections.findIndex((s) => s.id === id);

      if (_sections[index].args) {
        const argIndex = (_sections[index].args as any).findIndex(
          (f) => f.id === fieldId
        );
        _sections[index].args?.splice(argIndex, 1);
        setSections(_sections);
      }
    },
    [sections]
  );

  return (
    <div className="min-h-screen">
      <div className="h-10 px-4 py-2 border-b flex items-center justify-between text-sm">
        <div></div>
        <div className="flex items-center">
          <div
            className={cx("w-5 h-5 mr-2", {
              "text-green-600": connected,
              "text-red-500": !connected,
            })}
          >
            {connected ? PlugIcon : PlugXIcon}
          </div>
          <div className="mt-1 mr-2">
            <span>{connected ? `Connected.` : `Not connected.`}</span>
          </div>
          <div>
            {!connected ? (
              <Button small className="underline" label="Connect to app" />
            ) : null}
          </div>
        </div>
      </div>
      <ul className="list-none mt-8">
        {sections.map((s, index) => {
          const fields = sections
            .slice(0, index)
            .filter((s) => s.type === "form")
            .reduce((accu: FormField[], curr) => {
              return accu.concat(
                (curr.value as FormField[]).filter(
                  (f) => f.name && !s.args?.map((_f) => _f.id).includes(f.id)
                )
              );
            }, []);

          return (
            <div key={`section-${s.id}`}>
              <Section
                {...s}
                fields={fields}
                updateSection={updateSection}
                deleteSection={deleteSection}
                moveSection={moveSection}
                setSectionStatus={setSectionStatus}
                toggleStep={toggleStep}
                addArgument={addArgument}
                deleteArgument={deleteArgument}
              />
              <SectionDivider id={s.id} insertSection={insertSection} />
            </div>
          );
        })}
      </ul>
    </div>
  );
}

function SectionDivider(props) {
  const { id, insertSection } = props;

  return (
    <div
      className={cx(
        "relative flex items-center py-1 justify-center opacity-0 hover:opacity-100"
      )}
    >
      {/* Divider line */}
      <div className="absolute border-b w-full top-1/2"></div>
      {/* Buttons */}
      <div className="bg-white px-4 py-1 border border-gray-400 rounded-full drop-shadow-md">
        <div className="grid grid-cols-3 gap-4">
          <Button
            icon={MarkdownIcon}
            hint="Add markdown"
            onClick={() => insertSection(id, "markdown")}
          />
          <Button
            icon={FormIcon}
            hint="Add a form"
            onClick={() => insertSection(id, "form")}
          />
          <Button
            icon={CodeIcon}
            hint="Add script"
            onClick={() => insertSection(id, "script")}
          />
        </div>
      </div>
    </div>
  );
}
