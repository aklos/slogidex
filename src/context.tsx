import React from "react";

type Props = { children: any };

type ContextState = {
  currentDocument: Types.Document | null;
  currentInstance: Types.Instance | null;
  selectedStep: Types.Step | null;
  selectedStepUpdate: ((value: any) => void) | null;
};

type ContextMethods = {
  selectDocument: (document: Types.Document | null) => void;
  selectInstance: (instance: Types.Instance | null) => void;
  selectStep: (
    step: Types.Step | null,
    update: ((value: any) => void) | null
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
  state = {
    currentDocument: null,
    currentInstance: null,
    selectedStep: null,
    selectedStepUpdate: null,
  };

  selectDocument = (document: Types.Document | null) => {
    this.setState({ currentDocument: document });
  };

  selectInstance = (instance: Types.Instance | null) => {
    this.setState({ currentInstance: instance });
  };

  selectStep = (
    step: Types.Step | null,
    update: ((value: any) => void) | null = null
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
