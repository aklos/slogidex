import React, { useContext, useState } from "react";
import cx from "classnames";
import Blockies from "react-blockies";
import { format, formatDistance } from "date-fns";
import {
  Search,
  Play,
  PlusSquare,
  PinFill,
  PinAngle,
  Clock,
} from "react-bootstrap-icons";
import Context from "../context";
import Input from "./lib/Input";
import { useNavigate, useParams } from "react-router-dom";
import Button from "./lib/Button";
import Editable from "./lib/Editable";

export default function Catalogue() {
  const [search, setSearch] = useState("");
  const context = useContext(Context);
  const params = useParams<{ processId: string; instanceId: string }>();
  const navigate = useNavigate();

  return (
    <div
      className={cx(
        "w-80 flex-shrink-0 border-r dark:border-black",
        "bg-stone-100 dark:bg-stone-900",
        "text-sm"
      )}
    >
      <div className="">
        <Input
          Icon={Search}
          placeholder="Search catalogue"
          value={search}
          onChange={(v) => setSearch(v)}
        />
      </div>
      <div className="flex items-center justify-end border-b dark:border-black">
        <Button
          Icon={PlusSquare}
          label="New process"
          title="Create a new process"
          onClick={() => {
            const processId = context.addProcess();
            navigate(`/${processId}`);
          }}
        />
      </div>
      <ul>
        {context.processes
          .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
          .map((p) => (
            <ProcessEntry
              key={p.id}
              process={p}
              selected={params.processId === p.id}
              selectedInstance={params.instanceId}
            />
          ))}
      </ul>
    </div>
  );
}

function ProcessEntry(props: {
  process: Types.Process;
  selected: boolean;
  selectedInstance?: string;
}) {
  const { process, selected, selectedInstance } = props;
  const context = useContext(Context);
  const navigate = useNavigate();

  const instance = process.instances.find((i) => i.id === selectedInstance);

  return (
    <li>
      <div
        className={cx(
          "border-b dark:border-black cursor-pointer",
          "transition duration-100",
          {
            "hover:bg-blue-300/10": !selected,
            "bg-blue-300/40 dark:bg-blue-800/10":
              selected && instance && !instance.test,
            "font-bold bg-blue-300 dark:bg-blue-800":
              selected && (!instance || instance.test),
          }
        )}
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/${process.id}`);
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="px-2">
              <Blockies seed={process.id} size={3} className="rounded-sm" />
            </div>
            <div>{process.name}</div>
          </div>
          <div>
            <Button
              Icon={Play}
              title="Start a new instance"
              onClick={() => {
                const newInstance = context.addInstance(process.id);
                navigate(`/${process.id}/${newInstance.id}`);
              }}
            />
          </div>
        </div>
      </div>
      {selected && process.instances.length ? (
        <ul className="bg-black/5 dark:bg-black/20 border-b dark:border-black">
          {process.instances
            .filter((i) => !i.test)
            .sort((a, b) => b.createdAt.valueOf() - a.createdAt.valueOf())
            .map((i) => (
              <InstanceEntry
                key={i.id}
                processId={process.id}
                instance={i}
                selected={selectedInstance === i.id}
              />
            ))}
        </ul>
      ) : null}
    </li>
  );
}

function InstanceEntry(props: {
  processId: string;
  instance: Types.Instance;
  selected: boolean;
}) {
  const { processId, instance, selected } = props;
  const context = useContext(Context);
  const navigate = useNavigate();

  const togglePinned = () => {
    instance.pinned = !instance.pinned;
    context.updateInstance(processId, instance);
  };

  const updateName = (value: string) => {
    instance.name = value;
    context.updateInstance(processId, instance);
  };

  return (
    <li
      className={cx("pl-2 py-0.5 text-xs transition duration-100", {
        "hover:bg-yellow-100/10 cursor-pointer": !selected,
        "bg-yellow-300 dark:bg-yellow-400 text-gray-900": selected,
      })}
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/${processId}/${instance.id}`);
      }}
    >
      <div className="flex items-center justify-between">
        <div className="w-full flex items-center">
          <div
            className={cx("w-full mr-2", {
              italic: !instance.name,
              "font-bold": selected,
            })}
          >
            {selected ? (
              <Editable onChange={updateName}>
                {instance.name || "Instance"}
              </Editable>
            ) : (
              instance.name || "Instance"
            )}
          </div>
          <div
            className="flex items-center flex-shrink-0 mr-1"
            style={{ fontSize: "0.6rem" }}
          >
            <div className="mr-1">
              <Clock />
            </div>
            <div>{formatDistance(new Date(), instance.createdAt) + " ago"}</div>
          </div>
        </div>
        <div className="flex-shrink-0">
          <Button
            Icon={instance.pinned ? PinFill : PinAngle}
            title="Pin this instance"
            onClick={togglePinned}
          />
        </div>
      </div>
    </li>
  );
}
