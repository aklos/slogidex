import React from "react";

type Props = { children: any };

type ContextState = {
  selectedStep: Types.Step | null;
  selectedStepUpdate: ((content: string) => void) | null;
};

type ContextMethods = {
  selectStep: (
    step: Types.Step | null,
    update: ((content: string) => void) | null
  ) => void;
};

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
  state = { selectedStep: null, selectedStepUpdate: null };

  selectStep = (
    step: Types.Step | null,
    update: ((content: string) => void) | null = null
  ) => {
    this.setState({ selectedStep: step, selectedStepUpdate: update });
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
