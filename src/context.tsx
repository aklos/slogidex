import React from "react";
import { v4 as uuidv4 } from "uuid";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/tauri";
import user_manual from "./user_manual.json";
import { getArgString } from "./utils";

type Props = { children: any };

type ContextState = {
  selectedStepId: string;
  invokedScripts: Types.InvokedScript[];
} & Types.SaveData;

type ContextMethods = {
  toggleDarkMode: () => void;
  addProcess: () => string;
  deleteProcess: (id: string) => void;
  updateProcess: (id: string, data: Types.Process) => void;
  addInstance: (processId: string, test?: boolean) => Types.Instance;
  updateInstance: (processId: string, data: Types.Instance) => void;
  selectStep: (id: string) => void;
  runScript: (processId: string, instanceId: string, stepId: string) => void;
  getInstanceById: (instanceId: string) => Types.Instance;
};

const saveData: Types.SaveData = JSON.parse(
  localStorage.getItem("slogidex") ||
    // FIXME: Need to set defaults for all SaveData keys or else
    // #updateSaveData doesn't work.
    // Can this be simplified?
    JSON.stringify({ processes: [user_manual], darkMode: false }),
  // Format dates
  (key: string, value: string) => {
    if (typeof value === "string") {
      const a = Date.parse(value);
      if (a) {
        return a;
      }
    }

    return value;
  }
);

const internalMethods = [
  "props",
  "context",
  "refs",
  "updater",
  "state",
  "_reactInternals",
  "_reactInternalInstance",
];

const Context = React.createContext({} as ContextState & ContextMethods);

class ContextProvider extends React.Component<Props, ContextState> {
  state = {
    selectedStepId: "",
    invokedScripts: [],
    ...saveData,
  } as ContextState;

  toggleDarkMode = () => {
    this.setState({ darkMode: !this.state.darkMode }, this.#updateSaveData);
  };

  addProcess = () => {
    const processes = Array.from(this.state.processes);
    const newProcess = {
      id: uuidv4(),
      name: "New process",
      steps: [],
      instances: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    processes.push(newProcess);

    this.setState({ processes });

    return newProcess.id;
  };

  updateProcess = (id: string, process: Types.Process) => {
    const processes = Array.from(this.state.processes);
    const index = processes.findIndex((p) => p.id === id);
    processes[index] = process;
    this.setState({ processes }, this.#updateSaveData);
  };

  deleteProcess = (id: string) => {
    const processes = Array.from(this.state.processes);
    const index = processes.findIndex((p) => p.id === id);
    processes.splice(index, 1);
    this.setState({ processes }, this.#updateSaveData);
  };

  addInstance = (processId: string, test: boolean = false) => {
    const processes = Array.from(this.state.processes);
    const index = processes.findIndex((p) => p.id === processId);

    const instance = {
      id: uuidv4(),
      test,
      pinned: false,
      name: "",
      state: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    processes[index].instances.push(instance);

    this.setState({ processes });

    return instance;
  };

  updateInstance = (processId: string, instance: Types.Instance) => {
    const processes = Array.from(this.state.processes);
    const index = processes.findIndex((p) => p.id === processId);
    const instanceIndex = processes[index].instances.findIndex(
      (i) => i.id === instance.id
    );
    processes[index].instances[instanceIndex] = instance;
    this.setState({ processes }, this.#updateSaveData);
  };

  selectStep = (id: string) => {
    this.setState({ selectedStepId: id });
  };

  getInstanceById = (instanceId: string) => {
    const instances = this.state.processes.reduce((accu, curr) => {
      return accu.concat(curr.instances);
    }, [] as Types.Instance[]);

    return instances.find((i) => i.id === instanceId);
  };

  runScript = (processId: string, instanceId: string, stepId: string) => {
    const processes = Array.from(this.state.processes);
    const processIndex = processes.findIndex((p) => p.id === processId);
    const instanceIndex = processes[processIndex].instances.findIndex(
      (i) => i.id === instanceId
    );
    const stepIndex = processes[processIndex].steps.findIndex(
      (s) => s.id === stepId
    );
    const step = processes[processIndex].steps[stepIndex];
    const instance = processes[processIndex].instances[instanceIndex];

    const args = (step.content as Types.ScriptContent).args || [];
    let argString = "";

    if (args.length) {
      argString = getArgString(processes[processIndex], step, instance).replace(
        /undefined/g,
        ""
      );
    }

    if (instance && instance.state[step.id]) {
      instance.state[step.id] = {
        completed: false,
        data: "",
      };
      processes[processIndex].instances[instanceIndex] = instance;
      this.setState({ processes });
    }

    const invokedScripts = Array.from(this.state.invokedScripts);
    const index = invokedScripts.findIndex((x) => x.stepId === step.id);
    if (index !== -1) {
      invokedScripts[index].status = "running";
    } else {
      invokedScripts.push({ stepId: step.id, status: "running" });
    }

    this.setState({ invokedScripts });

    invoke("run_script", {
      invokeMessage: JSON.stringify({
        id: step.id,
        processId: processId,
        instanceId: instanceId,
        args: argString,
        script: (step.content as Types.ScriptContent).code,
      }),
    });
  };

  /**
   * This method updates the save data stored in the local storage.
   * It takes the current state of the application and uses it to form the save data.
   * Process instances in the save data are filtered to only leave pinned instances.
   */
  #updateSaveData = () => {
    const _saveData = Object.keys(saveData).reduce((accu, key) => {
      let val = (this.state as any)[key];

      if (key === "processes") {
        val = val.map((p: Types.Process) => Object.assign({}, p));
        // Filter out unpinned instances
        for (const process of val as Types.Process[]) {
          process.instances = process.instances.filter((i) => i.pinned);
        }
      }

      (accu as any)[key] = val;
      return accu;
    }, {} as Types.SaveData);

    window.localStorage.setItem("slogidex", JSON.stringify(_saveData));
  };

  #handleScriptEvent = (e: { payload: { message: string } }) => {
    const message = JSON.parse(e.payload.message) as {
      id: string;
      processId: string;
      instanceId: string;
      output: string;
      error: boolean;
    };

    const processes = Array.from(this.state.processes);
    const processIndex = processes.findIndex((p) => p.id === message.processId);
    const instanceIndex = processes[processIndex].instances.findIndex(
      (i) => i.id === message.instanceId
    );

    const instance = processes[processIndex].instances[instanceIndex];
    const isFinished = message.output === "__finished__";

    instance.state[message.id] = {
      completed: isFinished && !message.error,
      data: (
        (instance.state[message.id]?.data || "") +
        "\n" +
        (isFinished ? "" : message.output)
      ).trim(),
    };

    processes[processIndex].instances[instanceIndex] = instance;

    if (isFinished) {
      const invokedScripts = Array.from(this.state.invokedScripts);
      const index = invokedScripts.findIndex((x) => x.stepId === message.id);
      invokedScripts[index].status = message.error ? "failed" : "completed";
      this.setState({ invokedScripts });
    }

    this.setState({ processes });
  };

  componentDidMount = () => {
    listen("script-output", this.#handleScriptEvent);
  };

  #getPublicMethods = () => {
    const methodNames: string[] = Object.getOwnPropertyNames(this).filter(
      (x) => !internalMethods.includes(x)
    );

    return methodNames.reduce((accu, x) => {
      (accu as any)[x] = (this as any)[x];
      return accu;
    }, {});
  };

  render() {
    return (
      <Context.Provider
        value={
          Object.assign(
            {},
            this.state,
            this.#getPublicMethods()
          ) as ContextState & ContextMethods
        }
      >
        {this.props.children}
      </Context.Provider>
    );
  }
}

export default Context;
export { ContextProvider };
