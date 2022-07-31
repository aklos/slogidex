import axios from "axios";
import React from "react";
import Context from "../context";
import { useLoginMutation } from "../queries";
import Button from "./lib/Button";
import Input from "./lib/Input";
import * as Icon from "react-bootstrap-icons";

type Props = {
  title?: string;
};

export default function LoginForm(props: Props) {
  const { title } = props;
  const context = React.useContext(Context);
  const login = useLoginMutation();
  const [email, setEmail] = React.useState("");
  const [loginCode, setLoginCode] = React.useState("");

  const renderForm = () => {
    if (!login.isSuccess) {
      return (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            login.mutate({ email });
          }}
        >
          <div className="flex items-center">
            <label className="w-full mr-8">
              <Input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(value) => setEmail(value)}
              />
            </label>
            <Button
              submit
              callToAction
              className="px-2 py-1 w-auto whitespace-nowrap"
              Icon={Icon.Mailbox}
              label="Get login code"
              onClick={() => null}
            />
          </div>
        </form>
      );
    } else {
      return (
        <div>
          <div className="prose mb-4">
            <p>
              <span className="font-bold mr-1">We sent you an email.</span>
              <span>
                Check your mailbox and copy the login code to the field below to
                login.
              </span>
            </p>
          </div>
          <div className="flex items-center">
            <label className="w-full mr-8">
              <Input
                type="text"
                required
                placeholder="Login code"
                value={loginCode}
                onChange={(value) => setLoginCode(value)}
              />
            </label>
            <Button
              loose
              positive
              className="px-2 py-1 w-auto whitespace-nowrap"
              Icon={Icon.DoorOpen}
              label="Login"
              onClick={async () => {
                const res = await axios({
                  url: `https://localhost:3030/auth/login/callback?loginCode=${loginCode}`,
                });

                context.setSession(res.data);
              }}
            />
          </div>
        </div>
      );
    }
  };

  return (
    <div>
      <div className="prose mb-4">
        <h2>{title || "Please login"}</h2>
      </div>
      {renderForm()}
    </div>
  );
}
