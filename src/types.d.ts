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
    documentId?: string;
    createdAt: Date;
    updatedAt: Date;
    values: StepInstanceValue[];
    pinned?: boolean;
  }

  export interface StepInstanceValue {
    stepId: string;
    completed: boolean;
    fieldValues?: FieldValue[];
    output?: string;
    status?: ScriptStatus;
  }

  export type StepType = "script" | "markdown" | "form";
  export type ScriptStatus = "initial" | "running" | "completed" | "failed";
  export type FieldValue = { id: string; value: string | boolean };

  export type FieldType = "text" | "number" | "check" | "select" | "file";
  export type Option = { label: string; value: string };

  export interface FieldInterface {
    id: string;
    type: Types.FieldType;
    name: string;
    label: string;
    inline?: boolean;
    required?: boolean;
    defaultValue?: string | boolean;
    placeholder?: string;
    options?: Types.Option[];
    directory?: boolean;
  }

  export interface Step {
    id: string;
    type: StepType;
    required: boolean;
    content: string;
    args?: string[];
  }
}
