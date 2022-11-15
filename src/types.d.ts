declare module "prismjs/components/prism-core";

namespace Types {
  export interface SaveState {
    darkMode: boolean;
    documents: Document[];
  }

  export interface Document {
    id: string;
    name: string;
    steps: Step[];
    createdAt: Date;
    updatedAt: Date;
    instances: Instance[];
    locked: boolean;
  }

  export interface Instance {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    values: {
      stepId: string;
      completed: boolean;
      output?: string;
      status?: ScriptStatus;
      args?: string[];
    }[];
  }

  export type StepType = "script" | "markdown" | "form";
  export type ScriptStatus = "initial" | "running" | "completed" | "failed";

  // export type FieldType = "text" | "number" | "check" | "select" | "file";
  // export type Option = { label: string; value: string };

  // export interface Field {
  //   id: string;
  //   type: FieldType;
  //   value: string;
  //   label: string;
  //   name: string;
  //   options?: Option[];
  // }

  export interface Step {
    id: string;
    type: StepType;
    required: boolean;
    content: string;
  }
}
