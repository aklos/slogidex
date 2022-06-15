import * as React from "react";

type Props = { children: any };

type State = {};
type Methods = {};

const internalMethods = [
  "props",
  "context",
  "refs",
  "updater",
  "state",
  "_reactInternals",
  "_reactInternalInstance",
];

const Context = React.createContext({} as State & Methods);

class ContextProvider extends React.Component<Props, State> {
  state = {};

  #getPublicMethods = () => {
    const methodNames: string[] = Object.getOwnPropertyNames(this).filter(
      (x) => !internalMethods.includes(x)
    );

    return methodNames.reduce((accu, x) => {
      accu[x] = this[x];
      return accu;
    }, {});
  };

  render() {
    return (
      <Context.Provider
        value={Object.assign({}, this.state, this.#getPublicMethods())}
      >
        {this.props.children}
      </Context.Provider>
    );
  }
}

export default Context;
export { ContextProvider };
