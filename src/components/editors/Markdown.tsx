import * as React from "react";
import styled from "styled-components";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

const Container = styled.div`
  *:first-child {
    margin-top: 0;
  }

  li p {
    margin: 0;
  }

  *:last-child {
    margin-bottom: 0;
  }
`;

export default function Markdown(props: {
  data: Types.Step;
  update: (value: string) => void;
  locked: boolean;
}) {
  const { data, update, locked } = props;

  const onChange = React.useCallback(
    (e: any) => {
      const value = e.editor.getHTML();
      if (value !== data.content) {
        update(value);
      }
    },
    [data]
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write some markdown...",
      }),
    ],
    content: data.content,
    onUpdate: onChange,
    editable: !locked,
  });

  React.useEffect(() => {
    editor?.setEditable(!locked);
  }, [locked]);

  return (
    <Container className="px-2 py-1 prose dark:prose-invert max-w-none">
      <EditorContent editor={editor} />
    </Container>
  );
}
