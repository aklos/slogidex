import React, { useContext } from "react";
import Context from "../context";
import LogoLight from "./../logo_light.png";
import LogoDark from "./../logo_dark.png";
import { Link } from "react-router-dom";

export default function Overview() {
  const context = useContext(Context);
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {/* FIXME: Logo is so big that it slows the app down... */}
      <div>
        <img src={context.darkMode ? LogoDark : LogoLight} />
      </div>
      <div className="prose dark:prose-invert mt-8">
        <b>
          First time using the app?{" "}
          <Link to="/fd06e5cf-d026-49e1-9999-e263cef87460">
            Read the user manual.
          </Link>
        </b>
      </div>
    </div>
  );
}
