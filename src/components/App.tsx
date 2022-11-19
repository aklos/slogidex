import React from "react";
import cx from "classnames";
import { v4 as uuidv4 } from "uuid";
import { listen, UnlistenFn } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/tauri";
import {
  Routes,
  Route,
  useLocation,
  useParams,
  useNavigate,
} from "react-router-dom";
import _saveState from "../saveState";
import Inventory from "./Inventory";
import Overview from "./Overview";
import Document from "./Document";
import ContextMenu from "./ContextMenu";

let unlisten: UnlistenFn;

export default function App() {
  const [saveState, setSaveState] = React.useState<Types.SaveState>(_saveState);
  const [activeInstances, setActiveInstances] = React.useState<
    Types.Instance[]
  >([]);
  const [newInstance, setNewInstance] = React.useState<
    | (Types.Instance & {
        action: "runScript";
        documentId: string;
        stepId: string;
      })
    | null
  >(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    return () => {
      if (unlisten) {
        unlisten();
      }
    };
  }, []);

  React.useEffect(() => {
    localStorage.setItem("autotool", JSON.stringify(saveState));
  }, [saveState]);

  React.useEffect(() => {
    (async () => {
      if (unlisten) {
        unlisten();
      }
      unlisten = await listen("script-output", handleScriptOutputEvent);
    })();

    if (newInstance && newInstance.action) {
      if (newInstance.action === "runScript") {
        const document = saveState.documents.find(
          (d) => d.id === newInstance.documentId
        );
        const step = document?.steps.find((s) => s.id === newInstance.stepId);

        if (step) {
          invoke("run_script", {
            invokeMessage: JSON.stringify({
              id: step.id,
              instanceId: newInstance.id,
              args: "",
              script: step.content,
            }),
          });
        }
      }

      setNewInstance(null);
    }
  }, [activeInstances]);

  const handleScriptOutputEvent = React.useCallback(
    (e: any) => {
      const message = JSON.parse(e.payload.message);
      const instance = activeInstances.find((i) => i.id === message.instanceId);

      if (!instance) {
        console.log("handleScriptOutputEvent", "No instance found!");
        return;
      }

      const step =
        instance.values.find((v) => v.stepId === message.id) ||
        ({
          stepId: message.id,
          completed: false,
          status: "running",
        } as Types.StepInstanceValue);

      if (!step) {
        console.log("handleScriptOutputEvent", "No step found!");
        return;
      }

      if (message.output !== "__finished__") {
        step.output = step.output
          ? step.output + "\n" + message.output
          : message.output;

        if (message.error) {
          step.status = "failed";
        }
      } else if (step.status !== "failed") {
        step.status = "completed";
      }

      const _instance = Object.assign({}, instance);
      const stepIndex = _instance.values.findIndex(
        (v) => v.stepId === step.stepId
      );

      if (stepIndex === -1) {
        _instance.values.push(step);
      } else {
        _instance.values[stepIndex] = step;
      }

      // updateInstance(instance.id, _instance);
      const _instances = Array.from(activeInstances);
      const instanceIndex = _instances.findIndex((i) => i.id === _instance.id);
      _instances[instanceIndex] = _instance;
      setActiveInstances(_instances);
    },
    [activeInstances]
  );

  const runScript = React.useCallback(
    (documentId: string, instanceId: string, stepId: string) => {
      const document = saveState.documents.find((d) => d.id === documentId);

      if (!document) {
        throw new Error("No document found!");
      }

      const instance = activeInstances.find((i) => i.id === instanceId);
      let isNew = false;

      if (!instance) {
        const _instances = Array.from(activeInstances);
        const _instance = {
          id: instanceId,
          documentId,
          createdAt: new Date(),
          updatedAt: new Date(),
          values: [],
        };
        _instances.push(_instance);
        setActiveInstances(_instances);
        setNewInstance({
          ..._instance,
          action: "runScript",
          stepId,
          values: [
            {
              stepId,
              completed: false,
              status: "running",
            },
          ],
        });
        isNew = true;
      }

      const step = document?.steps.find((s) => s.id === stepId);

      if (step) {
        if (isNew) {
          navigate(`/${document.id}/${instanceId}`);
        } else {
          // Reset step
          const _instances = Array.from(activeInstances);
          const instanceIndex = _instances.findIndex(
            (i) => i.id === instanceId
          );
          const stepIndex = _instances[instanceIndex].values.findIndex(
            (v) => v.stepId === stepId
          );

          _instances[instanceIndex].values[stepIndex].completed = false;
          _instances[instanceIndex].values[stepIndex].output = "";
          _instances[instanceIndex].values[stepIndex].status = "running";

          setActiveInstances(_instances);

          invoke("run_script", {
            invokeMessage: JSON.stringify({
              id: stepId,
              instanceId: instanceId,
              args: "",
              script: step.content,
            }),
          });
        }
      }
    },
    [saveState, activeInstances]
  );

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

  const updateInstance = React.useCallback(
    (instanceId: string, value: Types.Instance) => {
      const _instances = Array.from(activeInstances);
      const instanceIndex = _instances.findIndex((i) => i.id === instanceId);

      if (instanceIndex === -1) {
        _instances.push(value);
      } else {
        _instances[instanceIndex] = value;
      }
      setActiveInstances(_instances);
    },
    [activeInstances]
  );

  // const invokeScript = React.useCallback(
  //   (instanceId: string) => {},
  //   [instances]
  // );
  //

  return (
    <div className={cx({ dark: !saveState.darkMode })}>
      <div className="relative w-full h-full font-sans text-neutral dark:bg-stone-800 dark:text-gray-300">
        <div className="flex min-h-screen max-h-screen">
          <Inventory
            documents={saveState.documents}
            activeInstances={activeInstances}
          />
          <div className="w-full max-h-screen overflow-auto">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path=":documentId">
                <Route
                  path=""
                  element={
                    <DocumentWrapper
                      documents={saveState.documents}
                      instances={activeInstances}
                      updateDocument={updateDocument}
                      updateInstance={updateInstance}
                      runScript={runScript}
                    />
                  }
                />
                <Route
                  path=":instanceId"
                  element={
                    <DocumentWrapper
                      documents={saveState.documents}
                      instances={activeInstances}
                      updateDocument={updateDocument}
                      updateInstance={updateInstance}
                      runScript={runScript}
                    />
                  }
                />
              </Route>
            </Routes>
          </div>
          <ContextMenu />
        </div>
        <DebugBreadcrumbs />
      </div>
    </div>
  );
}

function DocumentWrapper(props: {
  documents: Types.Document[];
  instances: Types.Instance[];
  updateDocument: (documentId: string, value: Types.Document) => void;
  updateInstance: (instanceId: string, value: Types.Instance) => void;
  runScript: (documentId: string, instanceId: string, stepId: string) => void;
}) {
  const { documents, instances, updateDocument, updateInstance, runScript } =
    props;
  const params = useParams();
  const document = documents.find((d) => d.id === params.documentId);

  // React.useEffect(() => {
  //   if (params.instanceId) {
  //     if (!context.instances.find((i) => i.id === params.instanceId)) {
  //       const _instances = Array.from(context.instances);
  //       _instances.push({
  //         id: params.instanceId,
  //         documentId: params.documentId,
  //         createdAt: new Date(),
  //         updatedAt: new Date(),
  //         values: [],
  //       });
  //       context.setInstances(_instances);
  //     }
  //   }
  // }, [params.instanceId]);

  if (!document) {
    return null; // 404
  }

  const instance = instances.find((i) => i.id === params.instanceId) || null;

  // if (params.instanceId && !instance) {
  //   console.log("no");
  //   return null; // loading
  // }
  // console.log("yes", params.instanceId, !!instance);

  // if (params.instanceId) {
  //   const instance = instances.find((i) => i.id === params.instanceId) || {
  //     id: uuidv4(),
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //     values: [],
  //   };

  //   context.setInstance(instance);
  // }

  return (
    <Document
      data={document}
      instance={instance}
      updateDocument={(value: Types.Document) =>
        updateDocument(document.id, value)
      }
      updateInstance={updateInstance}
      runScript={(stepId: string) =>
        runScript(
          document.id,
          instance?.id || params.instanceId || uuidv4(),
          stepId
        )
      }
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
