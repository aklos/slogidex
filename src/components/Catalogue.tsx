import React, { useContext, useState } from "react";
import cx from "classnames";
import Blockies from "react-blockies";
import { format } from "date-fns";
import {
  Search,
  Play,
  PlusSquare,
  ArrowsCollapse,
  PinFill,
  PinAngle,
} from "react-bootstrap-icons";
import Context from "../context";
import Input from "./lib/Input";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "./lib/Button";

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
      <div className="border-b dark:border-black">
        <Input
          Icon={Search}
          placeholder="Search catalogue"
          onChange={(v) => setSearch(v)}
        />
      </div>
      <div className="flex items-center justify-between border-b dark:border-black">
        <Button
          Icon={PlusSquare}
          label="New process"
          onClick={() => {
            const processId = context.addProcess();
            navigate(`/${processId}`);
          }}
        />
        {/* <Button Icon={ArrowsCollapse} label="Collapse" onClick={() => null} /> */}
      </div>
      <ul>
        {context.processes
          .filter((p) => p.name.includes(search))
          .map((p) => (
            <ProcessEntry
              key={p.id}
              data={p}
              selected={params.processId === p.id}
            />
          ))}
      </ul>
    </div>
  );
}

function ProcessEntry(props: { data: Types.Process; selected: boolean }) {
  const { data, selected } = props;
  const context = useContext(Context);
  const navigate = useNavigate();

  return (
    <li
      className={cx("border-b dark:border-black", {
        "bg-blue-400/20": selected,
      })}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="px-2">
            <Blockies seed={data.id} size={3} className="rounded-sm" />
          </div>
          <div>
            <Link to={`/${data.id}`}>{data.name}</Link>
          </div>
        </div>
        <div>
          <Button
            Icon={Play}
            onClick={() => {
              const instance = context.addInstance(data.id);
              navigate(`/${data.id}/${instance.id}`);
            }}
          />
        </div>
      </div>
      <div className="px-2 pb-0.5 text-xs italic opacity-30 flex items-center justify-end">
        <div>LR: {format(new Date(), "HH:mm:ss")}</div>
      </div>
      {selected ? (
        <ul>
          {data.instances.map((i) => (
            <InstanceEntry
              key={i.id}
              processId={data.id}
              data={i}
              selected={false}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function InstanceEntry(props: {
  processId: string;
  data: Types.Instance;
  selected: boolean;
}) {
  const { processId, data, selected } = props;
  const context = useContext(Context);

  const togglePinned = () => {
    data.pinned = !data.pinned;
    context.updateInstance(processId, data);
  };

  return (
    <li
      className={cx("pl-2 py-0.5 text-xs", {
        "bg-yellow-400/20": selected,
      })}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div>
            <Link to={`/${processId}/${data.id}`}>{data.id}</Link>
          </div>
        </div>
        <div>
          <Button
            Icon={data.pinned ? PinFill : PinAngle}
            onClick={togglePinned}
          />
        </div>
      </div>
    </li>
  );
}
