import * as React from "react";
import Process from "./Process";

export default function Document(props) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white mx-auto my-0 max-w-screen-xl drop-shadow-md">
        <Process />
      </div>
    </div>
  );
}
