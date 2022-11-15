import React from "react";
import cx from "classnames";
import { Routes, Route, useLocation, useParams } from "react-router-dom";
import _saveState from "../saveState";
import Inventory from "./Inventory";
import Overview from "./Overview";
import Document from "./Document";

export default function App() {
  const [saveState, setSaveState] = React.useState<Types.SaveState>(_saveState);

  React.useEffect(() => {
    localStorage.setItem("autotool", JSON.stringify(saveState));
  }, [saveState]);

  const updateDocument = React.useCallback(
    (documentId: string, value: Types.Document) => {
      const _saveState = Object.assign({}, saveState);
      const documentIndex = _saveState.documents.findIndex(
        (d) => d.id === documentId
      );
      _saveState.documents[documentIndex] = value;
      setSaveState(_saveState);
    },
    [saveState]
  );

  return (
    <div className={cx({ dark: !saveState.darkMode })}>
      <div className="relative w-full h-full font-sans text-neutral dark:bg-stone-800 dark:text-gray-300">
        <div className="flex min-h-screen max-h-screen">
          <Inventory documents={saveState.documents} />
          <div className="w-full max-h-screen overflow-auto">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path=":documentId">
                <Route
                  path=""
                  element={
                    <DocumentWrapper
                      documents={saveState.documents}
                      updateDocument={updateDocument}
                    />
                  }
                />
                <Route
                  path=":instanceId"
                  element={
                    <DocumentWrapper
                      documents={saveState.documents}
                      updateDocument={updateDocument}
                    />
                  }
                />
              </Route>
            </Routes>
          </div>
        </div>
        <DebugBreadcrumbs />
      </div>
    </div>
  );
}

function DocumentWrapper(props: {
  documents: Types.Document[];
  updateDocument: (documentId: string, value: Types.Document) => void;
}) {
  const { documents, updateDocument } = props;
  const params = useParams();
  const document = documents.find((d) => d.id === params.documentId);

  if (!document) {
    return null; // 404
  }

  const instance = document.instances.find((i) => i.id === params.instanceId);

  return (
    <Document
      data={document}
      instanceId={instance?.id || ""}
      update={(value: Types.Document) => updateDocument(document.id, value)}
    />
  );
}

function DebugBreadcrumbs() {
  const location = useLocation();
  return (
    <div className="absolute group right-0 bottom-0 w-10 h-6">
      <div className="absolute opacity-0 group-hover:opacity-100 bg-black whitespace-nowrap right-0">
        {location.pathname}
      </div>
    </div>
  );
}
