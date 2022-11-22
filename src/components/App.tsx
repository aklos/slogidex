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
import Context from "../context";

let unlisten: UnlistenFn;

export function mapArgs(
  document: Types.Document,
  instance: Types.Instance | null,
  step: Types.Step
) {
  let result = "";
  const args = step.args || [];
  const stepIndex = document.steps.findIndex((s) => s.id === step.id);
  for (const arg of args) {
    // Find *latest* field matching arg name
    const value: string | boolean = document.steps
      .slice(0, stepIndex)
      .filter((s) => s.type === "form")
      .reduce((accu: any, curr: any) => {
        const fields: Types.FieldInterface[] = JSON.parse(curr.content || "[]");
        const field = fields.find((f) => f.name === arg);
        if (field) {
          const instanceValue = instance?.values.find(
            (v) => v.stepId === curr.id
          );
          const instanceField = instanceValue?.fieldValues?.find(
            (fv) => fv.id === field.id
          );
          return instanceField?.value || field.defaultValue || "";
        }
        return accu;
      }, "");

    result += `--${arg}=${value}!`;
  }
  return result.trim().slice(0, -1);
}

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
  const context = React.useContext(Context);

  React.useEffect(() => {
    return () => {
      if (unlisten) {
        unlisten();
      }
    };
  }, []);

  // React.useEffect(() => {
  //   if (
  //     context.currentInstance &&
  //     !activeInstances.map((i) => i.id).includes(context.currentInstance.id)
  //   ) {
  //     updateInstance(context.currentInstance.id, context.currentInstance);
  //   }
  // }, [context.currentInstance]);

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

        if (document && step) {
          invoke("run_script", {
            invokeMessage: JSON.stringify({
              id: step.id,
              instanceId: newInstance.id,
              args: mapArgs(document, newInstance, step),
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
      } else {
        if (message.error) {
          step.status = "failed";
        } else {
          step.completed = true;
          step.status = "completed";
        }
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
        const _instance = {
          id: instanceId,
          documentId,
          createdAt: new Date(),
          updatedAt: new Date(),
          values: [],
        };
        updateInstance(instanceId, _instance);
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

          if (stepIndex !== -1) {
            _instances[instanceIndex].values[stepIndex].completed = false;
            _instances[instanceIndex].values[stepIndex].output = "";
            _instances[instanceIndex].values[stepIndex].status = "running";
          }

          setActiveInstances(_instances);

          invoke("run_script", {
            invokeMessage: JSON.stringify({
              id: stepId,
              instanceId: instanceId,
              args: mapArgs(document, _instances[instanceIndex], step),
              script: step.content,
            }),
          });
        }
      }
    },
    [saveState, activeInstances]
  );

  const addDocument = React.useCallback(() => {
    const _saveState = Object.assign({}, saveState);
    const document = {
      id: uuidv4(),
      name: "New document",
      steps: [
        {
          id: uuidv4(),
          type: "markdown",
          content: "",
          required: false,
        },
      ] as Types.Step[],
      createdAt: new Date(),
      updatedAt: new Date(),
      instances: [] as Types.Instance[],
      locked: false,
    };
    _saveState.documents.push(document);
    setSaveState(_saveState);
    navigate(`/${document.id}`);
  }, [saveState]);

  const deleteDocument = React.useCallback(
    (documentId: string) => {
      const _saveState = Object.assign({}, saveState);
      const documentIndex = _saveState.documents.findIndex(
        (d) => d.id === documentId
      );
      _saveState.documents.splice(documentIndex, 1);
      setSaveState(_saveState);
    },
    [saveState]
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

      console.log("updateInstance", instanceIndex);

      if (instanceIndex === -1) {
        const parentDoc = saveState.documents.find(
          (d) => d.id === value.documentId
        );
        const activeInstanceCount = _instances.filter(
          (i) => i.documentId === parentDoc?.id
        ).length;
        if (parentDoc && activeInstanceCount > 0) {
          // Find existing active instance
          const oldIndex = _instances
            .filter((i) => i.documentId === parentDoc.id)
            .findIndex((i) => {
              if (parentDoc.instances.map((_i) => _i.id).includes(i.id)) {
                return false;
              }
              return true;
            });
          console.log(oldIndex);
          if (oldIndex !== -1) {
            _instances[oldIndex] = value;
          } else {
            _instances.push(value);
          }
        } else {
          _instances.push(value);
        }
      } else {
        _instances[instanceIndex] = value;
      }

      const document = Object.assign({}, saveState).documents.find((d) => {
        if (d.instances.map((i) => i.id).includes(instanceId)) {
          return true;
        }
      });

      if (document) {
        const index = document.instances.findIndex((i) => i.id === instanceId);
        document.instances[index] = value;
        updateDocument(document.id, document);
      }

      setActiveInstances(_instances);
    },
    [activeInstances, saveState]
  );

  const toggleInstancePin = React.useCallback(
    (documentId: string, instanceId: string) => {
      const document = Object.assign({}, saveState).documents.find(
        (d) => d.id === documentId
      );
      if (!document) {
        return;
      }

      const instanceIndex = document?.instances.findIndex(
        (i) => i.id === instanceId
      );

      if (instanceIndex === -1) {
        const instance = activeInstances.find((i) => i.id === instanceId);
        if (instance) {
          document.instances.push(instance);
        }
      } else {
        document.instances.splice(instanceIndex, 1);
      }

      updateDocument(documentId, document);
    },
    [activeInstances, saveState]
  );

  const toggleDarkMode = React.useCallback(() => {
    const _saveState = Object.assign({}, saveState, {
      darkMode: !saveState.darkMode,
    });
    setSaveState(_saveState);
  }, [saveState]);

  return (
    <div className={cx({ dark: saveState.darkMode })}>
      <div className="relative w-full h-full font-sans text-neutral bg-stone-50 dark:bg-stone-800 dark:text-gray-300">
        <div className="flex min-h-screen max-h-screen">
          <Inventory
            addDocument={addDocument}
            documents={saveState.documents}
            activeInstances={activeInstances}
            toggleInstancePin={toggleInstancePin}
            darkMode={saveState.darkMode}
            toggleDarkMode={toggleDarkMode}
          />
          <div className="w-full max-h-screen overflow-auto">
            <Routes>
              <Route
                path="/"
                element={<Overview dark={saveState.darkMode} />}
              />
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
                      deleteDocument={deleteDocument}
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
                      deleteDocument={deleteDocument}
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
  deleteDocument: (documentId: string) => void;
  updateDocument: (documentId: string, value: Types.Document) => void;
  updateInstance: (instanceId: string, value: Types.Instance) => void;
  runScript: (documentId: string, instanceId: string, stepId: string) => void;
}) {
  const {
    documents,
    instances,
    deleteDocument,
    updateDocument,
    updateInstance,
    runScript,
  } = props;
  const context = React.useContext(Context);
  const params = useParams();
  const navigate = useNavigate();
  const document = documents.find((d) => d.id === params.documentId);

  React.useEffect(() => {
    if (document && document?.instances.length && params.instanceId) {
      const docInstance = document.instances.find(
        (i) => i.id === params.instanceId
      );
      if (!instances.find((i) => i.id === params.instanceId) && docInstance) {
        updateInstance(params.instanceId, docInstance);
      }
    }

    // FIXME: Triggered on reload. Create new instance instead.
    if (document && params.instanceId && !instances.length) {
      navigate("/");
    }

    // console.log(document, params.instanceId, instances.length);
    // if (document && params.instanceId && !instances.length) {
    //   updateInstance(params.instanceId, {
    //     id: uuidv4(),
    //     documentId: document.id,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //     values: [],
    //   });
    // }
  }, [document, params.instanceId]);
  
  React.useEffect(() => {
    context.selectStep(null, null);
  }, [params.documentId, params.instanceId]);

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
      deleteDocument={() => deleteDocument(document.id)}
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
