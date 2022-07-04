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
import { FormField } from "./FormEditor";
import Context from "../context";

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
  const context = React.useContext(Context);
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

  const outputMessageHandler = (e) => {
    const _sections = Array.from(sections);
    const index = _sections.findIndex((s) => s.id === e.detail.id);

    if (e.detail.output !== "__finished__") {
      if (_sections[index].output) {
        _sections[index].output += "\n" + e.detail.output;
      } else {
        _sections[index].output = e.detail.output;
      }
    } else {
      _sections[index].status = "completed";
    }

    setSections(_sections);
  };

  React.useEffect(() => {
    window.localStorage.setItem("doc", JSON.stringify(sections));
    document.addEventListener("output-message", outputMessageHandler);

    return () => {
      document.removeEventListener("output-message", outputMessageHandler);
    };
  }, [sections]);

  React.useEffect(() => {
    context.connectWebSocket();
  }, []);

  const runScript = React.useCallback(
    (id: String) => {
      if (context.connected) {
        const section = sections.find((s) => s.id === id);

        if (section) {
          const _sections = Array.from(sections);
          const index = _sections.findIndex((s) => s.id === section.id);

          _sections[index].output = undefined;

          setSections(_sections);

          context.socket?.send(
            JSON.stringify({
              id: section.id,
              args:
                section.args?.reduce((accu, curr) => {
                  return `${accu} --${curr.name}=${curr.value}`;
                }, "") || "",
              script: section.value,
            })
          );
        }
      }
    },
    [sections, context.connected]
  );

  const updateSection = React.useCallback(
    (id: string, value: string | FormField[]) => {
      const _sections = Array.from(sections);
      const index = _sections.findIndex((s) => s.id === id);

      _sections[index].value = value;

      if (_sections[index].type === "form") {
        const fields = _sections
          .filter((s) => s.type === "form")
          .reduce((accu: FormField[], curr) => {
            return accu.concat(curr.value as FormField[]);
          }, []);

        for (const formSection of _sections.filter(
          (s) => s.type === "script"
        )) {
          if (formSection.args) {
            const deleteArgs: string[] = [];

            for (const arg of formSection.args) {
              const match = fields.find((f) => f.id === arg.id);

              if (match) {
                arg.name = match.name;
                arg.value = match.value;
              } else {
                deleteArgs.push(arg.id);
              }
            }

            formSection.args = formSection.args.filter(
              (a) => !deleteArgs.includes(a.id)
            );
          }
        }
      }

      setSections(_sections);
    },
    [sections]
  );

  const deleteSection = React.useCallback(
    (id: string) => {
      const _sections = Array.from(sections);
      const index = _sections.findIndex((s) => s.id === id);
      const element = _sections[index];

      _sections.splice(index, 1);

      if (element.type === "form") {
        const fields = _sections
          .filter((s) => s.type === "form")
          .reduce((accu: FormField[], curr) => {
            return accu.concat(curr.value as FormField[]);
          }, []);

        for (const formSection of _sections.filter(
          (s) => s.type === "script"
        )) {
          if (formSection.args) {
            const deleteArgs: string[] = [];

            for (const arg of formSection.args) {
              const match = fields.find((f) => f.id === arg.id);

              if (match) {
                continue;
              } else {
                deleteArgs.push(arg.id);
              }
            }

            formSection.args = formSection.args.filter(
              (a) => !deleteArgs.includes(a.id)
            );
          }
        }
      }

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

      const fields = _sections
        .filter(
          (s, _index) =>
            s.type === "form" &&
            _index <= index + (element.type === "script" ? dir : 0)
        )
        .reduce((accu: FormField[], curr) => {
          return accu.concat(curr.value as FormField[]);
        }, []);

      for (const formSection of _sections.filter(
        (s, _index) => s.type === "script" && _index <= index
      )) {
        if (formSection.args) {
          const deleteArgs: string[] = [];

          for (const arg of formSection.args) {
            const match = fields.find((f) => f.id === arg.id);

            if (match) {
              continue;
            } else {
              deleteArgs.push(arg.id);
            }
          }

          formSection.args = formSection.args.filter(
            (a) => !deleteArgs.includes(a.id)
          );
        }
      }

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
            className={cx("w-5 h-5 mr-2 cursor-pointer", {
              "text-green-600": context.connected,
              "text-red-500": !context.connected,
            })}
            onClick={() => {
              context.connectWebSocket();
            }}
          >
            {context.connected ? PlugIcon : PlugXIcon}
          </div>
          <div className="mt-1 mr-2">
            <span>{context.connected ? `Connected.` : `Not connected.`}</span>
          </div>
          <div>
            {!context.connected ? (
              <a
                href={`codebook://hello`}
                className="inline-block mt-1 underline"
              >
                Launch app
              </a>
            ) : null}
          </div>
        </div>
      </div>
      <ul className="list-none mt-8 pb-16">
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
                runScript={runScript}
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
    <div className={cx("relative py-2 opacity-0 hover:opacity-100")}>
      {/* Divider line */}
      <div className="absolute border-b w-full top-1/2"></div>
      {/* Buttons */}
      <div className="absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 py-1 border border-gray-400 rounded-full drop-shadow-md">
        <div className="grid grid-cols-3 gap-2">
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
