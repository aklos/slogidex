declare module "prismjs/components/prism-core";

namespace Types {
  export type Storage = {
    sessionToken: string;
    darkMode: boolean;
    blueprints: Blueprint[];
    instances: BlueprintInstance[];
  };

  export type Panel = "library" | "settings";

  export type Tab = {
    id: string;
    blueprintId: string;
    instanceId?: string;
  };

  export type Blueprint = {
    id: string;
    name: string;
    steps: Step[];
    createdAt: Date;
    updatedAt: Date;
  };

  export type BlueprintInstance = Blueprint & {
    blueprintId: string;
  };

  export type StepType = "script" | "markdown" | "form";
  export type StepStatus = "initial" | "running" | "completed" | "failed";

  export type FieldType = "text" | "number" | "check" | "select" | "file";
  export type Option = { label: string; value: string };
  export type Field = {
    id: string;
    type: FieldType;
    value: string;
    label: string;
    name: string;
    options?: Option[];
  };

  export type Step = {
    id: string;
    value: string;
    name: string;
    type: StepType;
    status: StepStatus;
    required: boolean;
    output?: string;
    args?: Field[];
  };

  export type User = {
    id: number;
    email: string;
    confirmed_email: boolean;
    username: string;
    session_token: string;
    login_code: string;
    created_at: Date;
    updated_at: Date;
  };

  export type FeedbackComment = {
    id: number;
    user_id: number;
    thread_id: number;
    body: string;
    created_at: Date;
    updated_at: Date;
  };

  export type FeedbackVote = {
    id: number;
    user_id: number;
    thread_id: number;
    positive: boolean;
    created_at: Date;
    updated_at: Date;
  };

  export type FeedbackThread = {
    id: number;
    title: string;
    body: string;
    user_id: number;
    comments: FeedbackComment[];
    votes: FeedbackVote[];
    created_at: Date;
    updated_at: Date;
  };
}
