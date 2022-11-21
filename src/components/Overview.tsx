import * as React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as LogoLight } from "./../logo_light.svg";
import { ReactComponent as LogoDark } from "./../logo_dark.svg";
import Button from "./lib/Button";

export default function Overview(props: { dark: boolean }) {
  const { dark } = props;
  return (
    <div className="flex flex-col items-center justify-center p-32">
      <div className="ml-12">{dark ? <LogoDark /> : <LogoLight />}</div>
      <div className="prose dark:prose-invert mt-8">
        <h3>
          First time using the app?{" "}
          <Link to="/fd06e5cf-d026-49e1-9999-e263cef87460">
            Read the user manual.
          </Link>
        </h3>
      </div>
    </div>
  );
}
