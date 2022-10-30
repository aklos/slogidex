import React from "react";
import styled from "styled-components";
import SimpleMDE from "react-simplemde-editor";
import ReactMarkdown from "react-markdown";
import "easymde/dist/easymde.min.css";

// https://typora.io/
// https://levelup.gitconnected.com/rolling-our-own-medium-style-wysiwyg-c10fda0e5699

const Container = styled.div`
  .CodeMirror-scroll {
    min-height: auto !important;
  }

  .cm-s-easymde {
    border: 0;
    padding: 0;
    background: none;
  }

  &.dark {
    .cm-s-easymde {
      color: rgb(229 231 235);
    }
  }
`;

type Props = {
  editing: boolean;
  value: string;
  updateStep: (key: keyof Types.Step, value: string) => void;
};

export default function Markdown(props: Props) {
  const { editing, value, updateStep } = props;

  const options = React.useMemo(
    () => ({
      toolbar: false,
      status: false,
      placeholder: "Write markdown here...",
      spellChecker: false,
    }),
    []
  );

  return (
    <div className="relative px-3 py-1 mt-4 mb-4">
      <Container className="prose max-w-none min-h-[32px]">
        {editing ? (
          <SimpleMDE
            value={value}
            onChange={(v) => updateStep("value", v)}
            options={options}
          />
        ) : (
          <ReactMarkdown>{value || "Write markdown here..."}</ReactMarkdown>
        )}
      </Container>
    </div>
  );
}
