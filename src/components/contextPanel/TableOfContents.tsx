import React, { useContext } from "react";
import cx from "classnames";
import Context from "../../context";
import { ChevronRight, Dot } from "react-bootstrap-icons";

interface Props {
  process: Types.Process;
}

interface Heading {
  indent: number;
  label: string;
  stepId: string;
  index: number;
}

export default function TableOfContents(props: Props) {
  const { process } = props;
  const context = useContext(Context);

  const headings = process.steps
    .filter((s) => s.type === "text")
    .reduce((accu, curr) => {
      const match = (curr.content as string).match(
        /^<h([1-4])>[^<]*<\/h[1-4]>/
      );

      if (match) {
        accu.push({
          indent: +match[1],
          label: match[0].split(">")[1].split("<")[0],
          stepId: curr.id,
          index: process.steps.findIndex((s) => s.id === curr.id),
        });
      }

      return accu;
    }, [] as Heading[]);

  const minIndent = Math.min(...headings.map((h) => h.indent));
  const selectedIndex = process.steps.findIndex(
    (s) => s.id === context.selectedStepId
  );

  return (
    <ul>
      {headings.map((h, index) => (
        <li
          key={`heading_${h.label}`}
          className={cx(
            "px-2 py-1",
            "transition duration-100",
            "cursor-pointer",
            {
              "bg-black/10 dark:bg-white/10": selectedIndex === h.index,
              "hover:bg-black/5 dark:hover:bg-white/5":
                selectedIndex !== h.index,
            }
          )}
          onClick={() => {
            const xpath = `//h${h.indent}[text()='${h.label}']`;
            const elem = document.evaluate(
              xpath,
              document,
              null,
              XPathResult.FIRST_ORDERED_NODE_TYPE,
              null
            ).singleNodeValue;

            if (elem) {
              (elem as any).scrollIntoView({
                behavior: "smooth",
                block: "start",
              });

              context.selectStep(h.stepId);
            }
          }}
        >
          <div
            className={cx("flex items-center", {
              "ml-0": h.indent === minIndent,
              "ml-4": h.indent === minIndent + 1,
              "ml-8": h.indent === minIndent + 2,
              "ml-12": h.indent === minIndent + 3,
              "ml-16": h.indent === minIndent + 4,
            })}
          >
            <div className="mr-2">
              <Dot />
            </div>
            <div>{h.label}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
