import * as React from "react";
import { getHealth } from "../queries";
import Document from "./Document";

export default function App() {
  // const { isLoading, error, data } = getHealth();

  // React.useEffect(() => {
  //   if (!isLoading && (error || data)) {
  //     if (error) console.log(error);
  //     if (data) console.log(data);
  //   }
  // }, [isLoading]);

  return (
    <div className="w-full h-full min-h-screen text-gray-900 font-body">
      <Document />
    </div>
  );
}
