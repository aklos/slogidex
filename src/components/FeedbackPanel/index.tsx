import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import Context from "../../context";
import {
  useFeedbackThreadMutation,
  useFeedbackThreadsQuery,
} from "../../queries";
import Button from "../lib/Button";
import Input from "../lib/Input";
import TextArea from "../lib/TextArea";
import LoginForm from "../LoginForm";
import * as Icon from "react-bootstrap-icons";

export default function FeedbackPanel() {
  const context = React.useContext(Context);
  const { isLoading, error, data } = useFeedbackThreadsQuery();

  return (
    <div className="flex flex-grow">
      <div className="flex-shrink-0 w-1/3">
        {!context.session ? (
          <div className="p-8 mb-8">
            <LoginForm title="Please login to participate" />
          </div>
        ) : null}
        <FeedbackForm disabled={!context.session} />
      </div>
      <div className="w-full">
        {data?.map((t: Types.FeedbackThread) => (
          <Thread key={`thread_${t.id}`} {...t} />
        ))}
      </div>
    </div>
  );
}

function FeedbackForm(props: { disabled: boolean }) {
  const { disabled } = props;
  const queryClient = useQueryClient();
  const createThread = useFeedbackThreadMutation(queryClient);
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createThread.mutate({ title, body });

        setTitle("");
        setBody("");
      }}
      className="p-8"
    >
      <h2 className="text-xl mb-4">Post feedback</h2>
      <div className="mb-4">
        <label>
          <Input
            type="text"
            required
            disabled={disabled}
            placeholder="Title"
            value={title}
            onChange={(value) => setTitle(value)}
          />
        </label>
      </div>
      <div className="mb-4">
        <label>
          <TextArea
            required
            disabled={disabled}
            placeholder="Text"
            value={body}
            onChange={(value) => setBody(value)}
          />
        </label>
      </div>
      <div>
        <Button
          loose
          submit
          positive={!disabled}
          disabled={disabled}
          label="Submit"
          className="w-auto px-2 py-1"
        />
      </div>
    </form>
  );
}

function Thread(props: Types.FeedbackThread) {
  const { title, body, votes } = props;

  return (
    <div className="flex p-8 border-b">
      <div className="w-14 flex-shrink-0">
        <div className="flex items-center mb-2">
          <div className="mr-1">
            <Icon.ArrowUp size={16} />
          </div>
          <div className="text-xs opacity-50">
            {votes.filter((v) => v.positive).length}
          </div>
        </div>
        <div className="flex items-center">
          <div className="mr-1">
            <Icon.ArrowDown size={16} />
          </div>
          <div className="text-xs opacity-50">
            {votes.filter((v) => !v.positive).length}
          </div>
        </div>
      </div>
      <div className="prose max-w-none">
        <h3>{title}</h3>
        <p>{body}</p>
      </div>
    </div>
  );
}
