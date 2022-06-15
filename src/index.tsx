import * as React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ContextProvider } from "./context";
import App from "./components/App";

const container = document.getElementById("app");

if (!container) {
  throw Error("No #app container element found.");
}

const root = createRoot(container);
const queryClient = new QueryClient();

root.render(
  <QueryClientProvider client={queryClient}>
    <Router>
      <ContextProvider>
        <App />
      </ContextProvider>
    </Router>
  </QueryClientProvider>
);
