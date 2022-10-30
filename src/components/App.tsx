import React, { Dispatch, SetStateAction } from "react";
import cx from "classnames";
import { v4 as uuidv4 } from "uuid";
import { Routes, Route, Outlet, useParams } from "react-router-dom";
import TopBar from "./TopBar";
import DocumentPanel from "./DocumentPanel";
import FeedbackPanel from "./FeedbackPanel";
import Document from "./Document";
import { setApiSessionTokenHeader, useSessionQuery } from "../queries";
import Context from "../context";
import saveData from "../storage";

export default function App() {
  const context = React.useContext(Context);
  const { isLoading, error, data } = useSessionQuery();
  const [storage, setStorage] = React.useState<Types.Storage>(saveData);

  // On start, load existing session token from storage
  React.useEffect(() => {
    setApiSessionTokenHeader(storage.session_token);
  }, []);

  // Save storage on change
  React.useEffect(() => {
    window.localStorage.setItem("tbd", JSON.stringify(storage));
  }, [storage]);

  // Update session token in storage when session state updates
  React.useEffect(() => {
    const sessionToken = context.session?.session_token || "";

    if (sessionToken !== storage.session_token) {
      const _storage = Object.assign({}, storage, { sessionToken });
      setStorage(_storage);
    }
  }, [context.session]);

  // Update session
  React.useEffect(() => {
    if (!isLoading) {
      context.setSession(data || null);
    }
  }, [data]);

  return (
    <div className={cx({ dark: storage.dark_mode })}>
      <div className="w-full h-full font-sans text-gray-900 dark:bg-gray-900 dark:text-gray-300">
        <Routes>
          <Route
            path="/"
            element={
              <div className="relative min-h-screen h-full flex flex-col pt-[42px]">
                <TopBar
                  documents={storage.documents}
                  instances={storage.instances}
                  toggleDarkMode={() =>
                    setStorage(
                      Object.assign({}, storage, {
                        dark_mode: !storage.dark_mode,
                      })
                    )
                  }
                />
                <Outlet />
              </div>
            }
          >
            <Route
              path="/"
              element={
                <DocumentPanel storage={storage} setStorage={setStorage} />
              }
            >
              <Route
                index
                element={
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <h1>RUNME</h1>
                  </div>
                }
              />
              <Route
                path=":documentId"
                element={
                  <DocumentWrapper storage={storage} setStorage={setStorage} />
                }
              />
              <Route
                path=":documentId/:instanceId"
                element={
                  <DocumentWrapper storage={storage} setStorage={setStorage} />
                }
              />
            </Route>
            <Route path="feedback" element={<FeedbackPanel />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

function DocumentWrapper(props: {
  storage: Types.Storage;
  setStorage: Dispatch<SetStateAction<Types.Storage>>;
}) {
  const { storage, setStorage } = props;
  const { documentId, instanceId } = useParams();

  let document = storage.instances
    .concat(storage.documents as Types.Instance[])
    .find((d) => (instanceId ? d.id === instanceId : d.id === documentId));

  if (!document) {
    if (instanceId) {
      const blueprint = storage.documents.find((b) => b.id === documentId);

      document = Object.assign({}, blueprint, {
        id: instanceId,
        document_id: documentId,
        steps: blueprint?.steps.map(
          (s) => Object.assign({}, s, { id: uuidv4() }) || []
        ),
      }) as Types.Instance;
    } else {
      document = {
        id: documentId,
        name: "",
        steps: [
          {
            id: uuidv4(),
            value: "",
            type: "markdown",
            status: "initial",
            required: true,
          },
        ],
        created_at: new Date(),
        updated_at: new Date(),
      } as Types.Instance;
    }
  }

  const updateDocument = React.useCallback(
    (_document: Types.Instance) => {
      const _storage = Object.assign({}, storage);

      if (_document.document_id) {
        const index = _storage.instances.findIndex(
          (i) => i.id === _document.id
        );

        if (index === -1) {
          _storage.instances.push(_document);
        } else {
          _storage.instances[index] = _document;
        }
      } else {
        const index = _storage.documents.findIndex(
          (i) => i.id === _document.id
        );

        if (index === -1) {
          _storage.documents.push(_document);
        } else {
          _storage.documents[index] = _document;
        }
      }

      setStorage(_storage);
    },
    [storage]
  );

  if (!document) {
    return <div></div>;
  }

  /* TODO: Rename to "Document" */
  return (
    <Document
      key={`doc_panel_${documentId}_${instanceId}`}
      document={document}
      updateDocument={updateDocument}
    />
  );
}
