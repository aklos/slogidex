import React from "react";

type Props = { children: any };

type ContextState = {};

type ContextMethods = {
  connectWebSocket: () => void;
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
  state = {};

  connectWebSocket = () => {
    // const _socket = new WebSocket(
    //   process.env.LOCAL_WS_URL || "ws://localhost:8000/ws"
    // );
    // _socket.addEventListener("open", this.#handleSocketOpen);
    // _socket.addEventListener("message", this.#handleSocketMessage);
    // _socket.addEventListener("close", this.#handleSocketClose);
    // this.setState({
    //   socket: _socket,
    // });
  };

  // #handleSocketOpen = (e: any) => {
  //   console.log("open", e);
  //   this.setState({ connected: true });
  // };

  // #handleSocketMessage = (e: any) => {
  //   console.log("message", e);

  //   document.dispatchEvent(
  //     new CustomEvent("output-message", { detail: JSON.parse(e.data) })
  //   );
  // };

  // #handleSocketClose = (e: any) => {
  //   console.log("close", e);
  //   this.setState({ connected: false });
  // };

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
