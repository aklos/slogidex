import React, { Dispatch, SetStateAction } from "react";
import cx from "classnames";
import { v4 as uuidv4 } from "uuid";
import { Routes, Route, Outlet, useParams } from "react-router-dom";
import TopBar from "./TopBar";
import LibraryPanel from "./LibraryPanel";
import FeedbackPanel from "./FeedbackPanel";
import BlueprintPanel from "./BlueprintPanel";
import { setApiSessionTokenHeader, useSessionQuery } from "../queries";
import Context from "../context";
import saveData from "../storage";

export default function App() {
  const context = React.useContext(Context);
  const { isLoading, error, data } = useSessionQuery();
  const [storage, setStorage] = React.useState<Types.Storage>(saveData);
  const [tabs, setTabs] = React.useState<Types.Tab[]>([]);

  // On start, load existing session token from storage
  React.useEffect(() => {
    setApiSessionTokenHeader(storage.sessionToken);
  }, []);

  // Save storage on change
  React.useEffect(() => {
    window.localStorage.setItem("tbd", JSON.stringify(storage));
  }, [storage]);

  // Update session token in storage when session state updates
  React.useEffect(() => {
    const sessionToken = context.session?.session_token || "";

    if (sessionToken !== storage.sessionToken) {
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
    <div className={cx({ dark: storage.darkMode })}>
      <div className="w-full h-full font-sans text-gray-900 dark:bg-gray-800 dark:text-gray-100">
        <Routes>
          <Route
            path="/"
            element={
              <div className="min-h-screen h-full flex flex-col">
                <TopBar
                  tabs={tabs}
                  setTabs={setTabs}
                  blueprints={storage.blueprints}
                  instances={storage.instances}
                />
                <Outlet />
              </div>
            }
          >
            {/* TODO: Rename to "DocumentPanel" */}
            <Route
              path="/"
              element={
                <LibraryPanel storage={storage} setStorage={setStorage} />
              }
            >
              <Route
                index
                element={
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 prose">
                    <h1>Stepper</h1>
                  </div>
                }
              />
              <Route
                path=":blueprintId"
                element={
                  <BlueprintWrapper storage={storage} setStorage={setStorage} />
                }
              />
              <Route
                path=":blueprintId/:instanceId"
                element={
                  <BlueprintWrapper storage={storage} setStorage={setStorage} />
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

function BlueprintWrapper(props: {
  storage: Types.Storage;
  setStorage: Dispatch<SetStateAction<Types.Storage>>;
}) {
  const { storage, setStorage } = props;
  const { blueprintId, instanceId } = useParams();

  let document = storage.instances
    .concat(storage.blueprints as Types.BlueprintInstance[])
    .find((d) => (instanceId ? d.id === instanceId : d.id === blueprintId));

  if (!document) {
    if (instanceId) {
      const blueprint = storage.blueprints.find((b) => b.id === blueprintId);

      document = Object.assign({}, blueprint, {
        id: instanceId,
        blueprintId,
        steps: blueprint?.steps.map(
          (s) => Object.assign({}, s, { id: uuidv4() }) || []
        ),
      }) as Types.BlueprintInstance;
    } else {
      document = {
        id: blueprintId,
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
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Types.BlueprintInstance;
    }
  }

  const updateDocument = React.useCallback(
    (_document: Types.BlueprintInstance) => {
      const _storage = Object.assign({}, storage);

      if (_document.blueprintId) {
        const index = _storage.instances.findIndex(
          (i) => i.id === _document.id
        );

        if (index === -1) {
          _storage.instances.push(_document);
        } else {
          _storage.instances[index] = _document;
        }
      } else {
        const index = _storage.blueprints.findIndex(
          (i) => i.id === _document.id
        );

        if (index === -1) {
          _storage.blueprints.push(_document);
        } else {
          _storage.blueprints[index] = _document;
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
    <BlueprintPanel
      key={`bp_panel_${blueprintId}_${instanceId}`}
      document={document}
      updateDocument={updateDocument}
    />
  );
}
