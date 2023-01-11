declare module "prismjs/components/prism-core";

namespace Types {
  export interface SaveData {
    darkMode: boolean;
    processes: Process[];
  }

  export interface Process {
    id: string;
    name: string;
    steps: Step[];
    instances: Instance[];
    createdAt: Date;
    updatedAt: Date;
  }

  export interface Instance {
    id: string;
    test: boolean;
    pinned: boolean;
    name: string;
    state: InstanceState;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface StepInstanceValue {
    stepId: string;
    completed: boolean;
    fieldValues?: FieldValue[];
    output?: string;
    status?: ScriptStatus;
  }

  export interface InstanceState {
    [stepId: string]: StepState;
  }

  export interface StepState {
    completed: boolean;
    data: string | FieldStates;
  }

  export interface FieldStates {
    [fieldId: string]: string | boolean;
  }

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
    content: StepContent;
  }

  export type StepType = "script" | "text" | "form";
  export type StepContent = string | ScriptContent | FormContent;

  export interface ScriptContent {
    args: string[];
    code: string;
  }

  export interface FormContent {
    fields: FieldInterface[];
  }

  export interface InvokedScript {
    stepId: string;
    status: ScriptStatus;
  }
}
