import React, { useContext } from "react";
import cx from "classnames";
import Context from "../context";
import Catalogue from "./Catalogue";
import { Outlet, Route, Routes, useParams } from "react-router-dom";
import Overview from "./Overview";
import Process from "./Process";
import Toolbar from "./Toolbar";

export default function App() {
  const context = useContext(Context);

  return (
    <div className={cx({ dark: context.darkMode })}>
      <div
        className={cx(
          "relative w-screen h-full",
          "font-sans text-neutral",
          "bg-stone-50 dark:bg-stone-800 dark:text-gray-300"
        )}
      >
        <div className="flex flex-col h-screen">
          <Toolbar />
          <div className="flex flex-grow">
            <Routes>
              <Route path="/" element={<Container />}>
                <Route index element={<Overview />} />
                <Route path=":processId">
                  <Route index element={<ProcessWrapper />} />
                  <Route path=":instanceId" element={<ProcessWrapper />} />
                </Route>
              </Route>
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="w-full flex overflow-hidden">
      <Catalogue />
      <div className="w-full flex">
        <Outlet />
      </div>
    </div>
  );
}

/**
 * ProcessWrapper
 *
 * A React component for retrieving process data and instance data based on
 * processId and instanceId.
 */
function ProcessWrapper() {
  const context = useContext(Context);
  const params = useParams<{ processId: string; instanceId: string }>();
  const data = context.processes.find((p) => p.id === params.processId);

  if (!data) {
    // TODO: Do something here?
    return null;
  }

  const instance = params.instanceId
    ? context.getInstanceById(params.instanceId)
    : undefined;

  return <Process data={data} instance={instance} />;
}
