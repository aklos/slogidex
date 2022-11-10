import React, { Dispatch, SetStateAction } from "react";
import cx from "classnames";
import {
  Routes,
  Route,
  Outlet,
  useParams,
  useLocation,
} from "react-router-dom";
// import TopBar from "./TopBar.old";
// import DocumentPanel from "./old/DocumentPanel";
// import FeedbackPanel from "./old/FeedbackPanel";
// import Document from "./old/Document";
// import { setApiSessionTokenHeader, useSessionQuery } from "../queries";
import Context from "../context";
import _saveState from "../saveState";
import Inventory from "./Inventory";

export default function App() {
  // const context = React.useContext(Context);
  const [saveState, setSaveState] = React.useState<Types.SaveState>(_saveState);

  React.useEffect(() => {
    localStorage.setItem("autotool", JSON.stringify(saveState));
  }, [saveState]);

  // // On start, load existing session token from storage
  // React.useEffect(() => {
  //   setApiSessionTokenHeader(storage.session_token);
  // }, []);

  // // Save storage on change
  // React.useEffect(() => {
  //   window.localStorage.setItem("autotool", JSON.stringify(storage));
  // }, [storage]);

  // // Update session token in storage when session state updates
  // React.useEffect(() => {
  //   const sessionToken = context.session?.session_token || "";

  //   if (sessionToken !== storage.session_token) {
  //     const _storage = Object.assign({}, storage, { sessionToken });
  //     setStorage(_storage);
  //   }
  // }, [context.session]);

  // // Update session
  // React.useEffect(() => {
  //   if (!isLoading) {
  //     context.setSession(data || null);
  //   }
  // }, [data]);

  return (
    <div className={cx({ dark: !saveState.darkMode })}>
      <div className="relative w-full h-full font-sans text-gray-900 dark:bg-stone-800 dark:text-gray-300">
        <div className="flex min-h-screen max-h-screen">
          <Inventory documents={saveState.documents} />
          <div className="w-full"></div>
        </div>
        <Breadcrumbs />
      </div>
    </div>
  );
}

function Breadcrumbs() {
  const location = useLocation();
  return (
    <div className="absolute group right-0 bottom-0 w-10 h-6">
      <div className="absolute opacity-0 group-hover:opacity-100 bg-black whitespace-nowrap right-0">
        {location.pathname}
      </div>
    </div>
  );
}

// function DocumentWrapper(props: {
//   storage: Types.Storage;
//   setStorage: Dispatch<SetStateAction<Types.Storage>>;
// }) {
//   const { storage, setStorage } = props;
//   const { documentId, instanceId } = useParams();

//   let document = storage.instances
//     .concat(storage.documents as Types.Instance[])
//     .find((d) => (instanceId ? d.id === instanceId : d.id === documentId));

//   if (!document) {
//     if (instanceId) {
//       const blueprint = storage.documents.find((b) => b.id === documentId);

//       document = Object.assign({}, blueprint, {
//         id: instanceId,
//         document_id: documentId,
//         steps: blueprint?.steps.map(
//           (s) => Object.assign({}, s, { id: uuidv4() }) || []
//         ),
//       }) as Types.Instance;
//     } else {
//       document = {
//         id: documentId,
//         name: "",
//         steps: [
//           {
//             id: uuidv4(),
//             value: "",
//             type: "markdown",
//             status: "initial",
//             required: true,
//           },
//         ],
//         created_at: new Date(),
//         updated_at: new Date(),
//       } as Types.Instance;
//     }
//   }

//   const updateDocument = React.useCallback(
//     (_document: Types.Instance) => {
//       const _storage = Object.assign({}, storage);

//       if (_document.document_id) {
//         const index = _storage.instances.findIndex(
//           (i) => i.id === _document.id
//         );

//         if (index === -1) {
//           _storage.instances.push(_document);
//         } else {
//           _storage.instances[index] = _document;
//         }
//       } else {
//         const index = _storage.documents.findIndex(
//           (i) => i.id === _document.id
//         );

//         if (index === -1) {
//           _storage.documents.push(_document);
//         } else {
//           _storage.documents[index] = _document;
//         }
//       }

//       setStorage(_storage);
//     },
//     [storage]
//   );

//   if (!document) {
//     return <div></div>;
//   }

//   return (
//     <Document
//       key={`doc_panel_${documentId}_${instanceId}`}
//       document={document}
//       updateDocument={updateDocument}
//     />
//   );
// }
