import React, { Dispatch, SetStateAction } from "react";
import Button from "../lib/Button";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { Link, useNavigate } from "react-router-dom";
import * as Icon from "react-bootstrap-icons";

type Props = {
  storage: Types.Storage;
  setStorage: Dispatch<SetStateAction<Types.Storage>>;
};

export default function LibraryPanel(props: Props) {
  const { storage, setStorage } = props;
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

  return (
    <div className="relative w-full grid grid-cols-2">
      <div className="p-8">
        {!storage.blueprints.length ? (
          <div className="prose">
            <h2>You don't have any blueprints yet.</h2>
            <p>
              Once you create one it'll show up here for editing or running.
            </p>
            <Button
              loose
              callToAction
              Icon={Icon.FilePlus}
              label="Get started now"
              onClick={() => navigate(uuidv4())}
            />
          </div>
        ) : (
          <>
            <div className="mb-4">
              <Button
                loose
                callToAction
                Icon={Icon.FilePlus}
                label="Create new document"
                onClick={() => navigate(uuidv4())}
              />
            </div>
            <ul className="list-disc">
              {storage.blueprints.map((b) => (
                <li key={`link_${b.id}`} className="list-inside">
                  <div className="flex items-center">
                    <h2 className="whitespace-nowrap mr-8 text-2xl underline">
                      <Link to={b.id}>{b.name || "New document"}</Link>
                    </h2>
                    <Button
                      positive
                      Icon={Icon.Plus}
                      className="w-auto mr-2"
                      onClick={() => navigate(`${b.id}/${uuidv4()}`)}
                    />
                    <Button
                      negative
                      Icon={Icon.Trash}
                      className="w-auto"
                      onClick={() => deleteBlueprint(b.id)}
                    />
                  </div>
                  {storage.instances.filter((i) => i.blueprintId === b.id)
                    .length ? (
                    <ul className="list-decimal">
                      {storage.instances
                        .filter((i) => i.blueprintId === b.id)
                        .map((i) => (
                          <li key={`link_${i.id}`} className="ml-8 list-inside">
                            <div className="flex items-center">
                              <h3 className="whitespace-nowrap mr-8 text-xl underline">
                                <Link to={`${b.id}/${i.id}`}>
                                  {format(i.createdAt, "MMM dd yyyy HH:mm:ss")}
                                </Link>
                              </h3>
                              <Button
                                negative
                                Icon={Icon.Trash}
                                className="w-auto"
                                onClick={() => deleteInstance(i.id)}
                              />
                            </div>
                          </li>
                        ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
