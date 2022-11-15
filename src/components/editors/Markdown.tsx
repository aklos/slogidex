import * as React from "react";
import Editable from "../lib/Editable";

export default function Markdown(props: { data: Types.Step }) {
  return <Editable onChange={(v) => null}>hello</Editable>;
}
