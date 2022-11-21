import * as React from "react";
import * as Icons from "react-bootstrap-icons";
import cx from "classnames";
import { format } from "date-fns";
import Button from "./lib/Button";
import Input from "./lib/Input";
import { useLocation, useNavigate } from "react-router-dom";

type DocumentEntryType = Types.Document & { toggled: boolean };

export default function Inventory(props: {
  addDocument: () => void;
  documents: Types.Document[];
  activeInstances: Types.Instance[];
  toggleInstancePin: (documentId: string, instanceId: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}) {
  const {
    addDocument,
    documents,
    activeInstances,
    toggleInstancePin,
    darkMode,
    toggleDarkMode,
  } = props;
  const [search, setSearch] = React.useState("");
  const [entries, setEntries] = React.useState<DocumentEntryType[]>(
    documents.map((d) => ({ ...d, toggled: false }))
  );
  const navigate = useNavigate();

  // FIXME: JSON string dependency is a bad solution?
  React.useEffect(() => {
    setEntries(
      documents.map((d) => {
        const entry = entries.find((e) => e.id === d.id) || { toggled: false };
        return { ...d, toggled: entry.toggled };
      })
    );
  }, [JSON.stringify(documents)]);

  const toggleEntry = React.useCallback(
    (documentId: string, forceOpen: boolean = false) => {
      const _entries = Array.from(entries);
      const index = _entries.findIndex((e) => e.id === documentId);
      _entries[index].toggled = forceOpen ? true : !_entries[index].toggled;
      setEntries(_entries);
    },
    [entries]
  );

  const collapseAll = React.useCallback(() => {
    const _entries = Array.from(entries);
    for (const entry of entries) {
      entry.toggled = false;
    }
    setEntries(_entries);
  }, [entries]);

  return (
    <div
      className={cx(
        "w-80 flex-grow flex-shrink-0",
        "dark:bg-stone-900 bg-stone-200 dark:border-black border-gray-300 border-r text-sm"
      )}
    >
      <div className="px-4 h-16 dark:border-black border-gray-300 border-b flex items-center">
        <Input
          Icon={Icons.Search}
          value={search}
          placeholder="Search inventory"
          onChange={(v) => setSearch(v)}
        />
      </div>
      <div className="px-4 flex justify-end dark:border-black border-gray-300 border-b">
        <Button
          Icon={Icons.PlusSquare}
          title="Create new document"
          label="New"
          onClick={addDocument}
        />
        <Button
          Icon={Icons.ArrowsCollapse}
          title="Collapse all"
          label="Collapse"
          onClick={collapseAll}
          disabled={entries.reduce((accu, curr) => {
            if (!accu || curr.toggled) {
              return false;
            }

            return accu;
          }, true)}
        />
      </div>
      <ul
        style={{ height: "calc(100vh - 80px - 40px - 14px)" }}
        className="overflow-y-auto"
      >
        {entries
          .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
          .map((e) => (
            <DocumentEntry
              key={e.id}
              id={e.id}
              name={e.name}
              toggled={e.toggled}
              toggle={(force: boolean) => toggleEntry(e.id, force)}
              numSteps={e.steps.length}
              instances={e.instances
                .map(
                  (i) => Object.assign({ pinned: true }, i) as Types.Instance
                )
                .concat(activeInstances.filter((i) => i.documentId === e.id))}
              toggleInstancePin={(instanceId: string) =>
                toggleInstancePin(e.id, instanceId)
              }
            />
          ))}
        {search ? (
          <li className="italic text-center opacity-50 text-xs mt-2">
            Filtered{" "}
            {
              entries.filter(
                (d) => !d.name.toLowerCase().includes(search.toLowerCase())
              ).length
            }{" "}
            documents
          </li>
        ) : null}
      </ul>
      <div className="h-[40px] text-base px-4 border-t border-gray-300 dark:border-black flex items-center">
        <div className="text-lg mr-4">
          <Button Icon={Icons.House} onClick={() => navigate("/")} />
        </div>
        <Button
          Icon={darkMode ? Icons.MoonStarsFill : Icons.MoonStars}
          onClick={toggleDarkMode}
        />
      </div>
    </div>
  );
}

function DocumentEntry(props: {
  id: string;
  name: string;
  numSteps: number;
  toggled: boolean;
  toggle: (force: boolean) => void;
  instances: Types.Instance[];
  toggleInstancePin: (instanceId: string) => void;
}) {
  const { id, name, numSteps, toggled, toggle, instances, toggleInstancePin } =
    props;
  const navigate = useNavigate();
  const location = useLocation();
  const selected = location.pathname.includes(id);

  const numFinishedInstances = instances.reduce((accu, curr) => {
    if (curr.values.length === numSteps) {
      return accu + 1;
    }

    return accu;
  }, 0);

  return (
    <>
      <li
        className={cx(
          "pr-4 py-1.5 flex items-center justify-between",
          "whitespace-nowrap",
          "transition duration-200",
          "font-bold",
          {
            "pl-2": instances.length,
            "pl-6": !instances.length,
            "cursor-pointer": instances.length || !selected,
            "bg-blue-400/20": selected,
          }
        )}
        onClick={() => navigate(`${id}`)}
      >
        <div className="flex items-center overflow-hidden">
          <div
            className={cx("text-sm mr-1", {
              hidden: instances.length === 0,
            })}
            onClick={instances.length ? () => toggle(false) : () => null}
          >
            {toggled ? <Icons.ChevronDown /> : <Icons.ChevronRight />}
          </div>
          <div className="text-sm overflow-hidden text-ellipsis">{name}</div>
        </div>
        <div
          className={cx("w-2 h-2 rounded-full flex-shrink-0 mr-0.5", {
            "bg-blue-400": instances.length === 0,
            "bg-transparent":
              instances.length > 0 && numFinishedInstances < instances.length,
          })}
        ></div>
      </li>
      <ul
        className={cx("", {
          hidden: !toggled,
        })}
      >
        {instances
          .sort((a, b) => b.createdAt.valueOf() - a.createdAt.valueOf())
          .filter((i) => {
            if (i.pinned) {
              return true;
            }

            const pinnedInstances = instances
              .filter((_i) => _i.pinned)
              .map((_i) => _i.id);
            if (pinnedInstances.includes(i.id)) {
              return false;
            }

            return true;
          })
          .map((i) => (
            <InstanceEntry
              key={i.id}
              id={i.id}
              documentId={id}
              progress={0}
              pinned={!!i.pinned}
              timestamp={i.createdAt}
              toggleDocument={() => toggle(true)}
              toggleInstancePin={() => toggleInstancePin(i.id)}
            />
          ))}
      </ul>
    </>
  );
}

function InstanceEntry(props: {
  id: string;
  documentId: string;
  progress: number;
  timestamp: Date;
  pinned: boolean;
  toggleDocument: () => void;
  toggleInstancePin: () => void;
}) {
  const {
    id,
    documentId,
    progress,
    timestamp,
    pinned,
    toggleDocument,
    toggleInstancePin,
  } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const selected = location.pathname.includes(id);

  React.useEffect(() => {
    if (selected) {
      toggleDocument();
    }
  }, [selected]);

  return (
    <li
      className={cx("px-4 py-1.5 text-sm", "transition duration-200", {
        "cursor-pointer": !selected,
        "bg-yellow-400/20": selected,
      })}
      onClick={() => navigate(`${documentId}/${id}`)}
    >
      <div className="flex justify-between items-center">
        <span className="pl-8">
          {format(timestamp, "MMM dd yyyy, HH:mm:ss")}
        </span>
        <div className="cursor-pointer" onClick={toggleInstancePin}>
          {pinned ? <Icons.PinFill /> : <Icons.PinAngle />}
        </div>
      </div>
    </li>
  );
}
