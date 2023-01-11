import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Context from "../../context";

interface Props {
  content: string;
  updateContent: (value: string) => void;
  editable: boolean;
}

const Container = styled.div`
  *:focus {
    outline: none;
  }

  *:first-child {
    margin-top: 0;
  }

  *:last-child {
    margin-bottom: 0;
  }
`;

export default function TextWidget(props: Props) {
  const { content, updateContent, editable } = props;
  const context = useContext(Context);

  const editor = useEditor({
    content,
    extensions: [
      StarterKit,
      Link,
      Placeholder.configure({
        placeholder: "Write some markdown...",
      }),
    ],
    onUpdate: (e) => {
      const value = e.editor.getHTML();
      updateContent(value);
    },
    editable,
  });

  useEffect(() => {
    editor?.setEditable(editable);
  }, [editable]);

  return (
    <Container className="prose dark:prose-invert max-w-none p-2">
      <EditorContent editor={editor} />
    </Container>
  );
}
