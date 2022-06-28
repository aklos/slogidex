import * as React from "react";
import Editor from "rich-markdown-editor";
import { light, dark } from "rich-markdown-editor/dist/styles/theme";

export default function MarkdownEditor(props) {
  const { value, updateSection } = props;

  return (
    <Editor
      className="prose max-w-none pl-2"
      theme={Object.assign({}, light, {
        fontFamily: "Poppins Light",
        fontFamilyMono: "IBM Plex Mono",
      })}
      defaultValue={value}
      onChange={(value) => updateSection(value())}
    />
  );
}
