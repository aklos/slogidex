import React, { Dispatch, SetStateAction } from "react";
import cx from "classnames";
import { Routes, Route, Outlet, useParams } from "react-router-dom";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { Link, useNavigate } from "react-router-dom";
import * as Icon from "react-bootstrap-icons";
import Button from "../lib/Button";

type Props = {
  storage: Types.Storage;
  setStorage: Dispatch<SetStateAction<Types.Storage>>;
};

export default function LibraryPanel(props: Props) {
  const { storage, setStorage } = props;
  const { blueprintId, instanceId } = useParams();
  const [collapsed, toggleCollapsed] = React.useState(false);
  const navigate = useNavigate();

  const deleteBlueprint = React.useCallback(
    (id: string) => {
      const _storage = Object.assign({}, storage);
      const index = _storage.blueprints.findIndex((b) => b.id === id);

      _storage.blueprints.splice(index, 1);
      _storage.instances = _storage.instances.filter(
        (i) => i.blueprintId !== id
      );

      setStorage(_storage);
    },
    [storage]
  );

  const deleteInstance = React.useCallback(
    (id: string) => {
      const _storage = Object.assign({}, storage);
      const index = _storage.instances.findIndex((b) => b.id === id);

      _storage.instances.splice(index, 1);

      setStorage(_storage);
    },
    [storage]
  );

  const isNew = instanceId
    ? !storage.instances.find((i) => i.id === instanceId)
    : !storage.blueprints.find((b) => b.id === blueprintId);

  return (
    <div className="relative w-full flex flex-grow">
      <div
        className={cx(
          "group relative flex-shrink-0 bg-gray-50 border-r border-gray-400",
          { "w-[300px]": !collapsed, "w-4": collapsed }
        )}
      >
        <div className="z-10 hidden group-hover:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
          <Button
            Icon={collapsed ? Icon.ChevronBarRight : Icon.ChevronBarLeft}
            className="p-1"
            onClick={() => toggleCollapsed(!collapsed)}
          />
        </div>
        {!collapsed ? (
          <ul className="list-none border-r flex flex-col h-full">
            {storage.blueprints.map((b) => (
              <li
                key={b.id}
                className={cx(
                  "relative flex-shrink-0 list-inside p-2 border-b whitespace-nowrap overflow-hidden overflow-ellipsis",
                  { "bg-blue-100": b.id === blueprintId }
                )}
              >
                <Link to={b.id}>{b.name || "New document"}</Link>
                <div className="absolute flex top-1/2 right-0 transform -translate-y-1/2">
                  <Button
                    Icon={Icon.CaretRightFill}
                    className="text-green-500 background-transparent p-1"
                    onClick={() => navigate(`${b.id}/${uuidv4()}`)}
                  />
                  <Button
                    Icon={Icon.TrashFill}
                    className="text-red-500 background-transparent p-1"
                    onClick={() => deleteBlueprint(b.id)}
                  />
                </div>
              </li>
            ))}
            {blueprintId && !instanceId && isNew ? (
              <li className="list-inside p-2 border-b italic bg-blue-100">
                New document
              </li>
            ) : null}
            <div className="h-full"></div>
            <li className="list-inside flex-shrink-0">
              <Button
                className="justify-center bg-green-400 p-2"
                Icon={Icon.FilePlus}
                label="Create new document"
                onClick={() => navigate(uuidv4())}
              />
            </li>
          </ul>
        ) : null}
      </div>
      <div className="relative w-full flex flex-grow">
        <Outlet />
      </div>
      {blueprintId ? (
        <div
          className={cx(
            "group relative flex-shrink-0 bg-gray-50 border-l border-gray-400",
            { "w-[300px]": !collapsed, "w-4": collapsed }
          )}
        >
          {!collapsed ? (
            <ul>
              {instanceId && isNew ? (
                <li className="list-inside p-2 border-b italic bg-yellow-100">
                  New instance
                </li>
              ) : null}
              {blueprintId
                ? storage.instances
                    .filter((i) => i.blueprintId === blueprintId)
                    .map((i) => (
                      <li
                        key={i.id}
                        className={cx(
                          "relative list-inside p-2 border-b whitespace-nowrap overflow-hidden overflow-ellipsis",
                          {
                            "bg-yellow-100": i.id === instanceId,
                          }
                        )}
                      >
                        <Link to={`${i.blueprintId}/${i.id}`}>
                          {format(
                            new Date(i.createdAt),
                            "MMM dd yyyy HH:mm:ss"
                          )}
                        </Link>
                        <div className="absolute flex top-1/2 right-0 transform -translate-y-1/2">
                          <Button
                            Icon={Icon.TrashFill}
                            className="text-red-500 background-transparent p-1"
                            onClick={() => deleteInstance(i.id)}
                          />
                        </div>
                      </li>
                    ))
                : null}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
