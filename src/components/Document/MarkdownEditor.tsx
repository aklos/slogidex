import React from "react";
import styled from "styled-components";
import SimpleMDE from "react-simplemde-editor";
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
  }
`;

type Props = {
  value: any;
  updateSection: any;
};

export default function MarkdownEditor(props: Props) {
  const { value, updateSection } = props;

  const options = React.useMemo(
    () => ({
      toolbar: false,
      status: false,
      placeholder: "Write markdown here...",
    }),
    []
  );

  return (
    <Container>
      <SimpleMDE value={value} onChange={updateSection} options={options} />
    </Container>
  );
}
