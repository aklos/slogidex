import React, { Dispatch, SetStateAction } from "react";
import cx from "classnames";
import { v4 as uuidv4 } from "uuid";
import Button from "./lib/Button";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as Icon from "react-bootstrap-icons";

type Props = {
  tabs: Types.Tab[];
  setTabs: Dispatch<SetStateAction<Types.Tab[]>>;
  blueprints: Types.Blueprint[];
  instances: Types.BlueprintInstance[];
};

export default function TopBar(props: Props) {
  const { tabs, setTabs, blueprints, instances } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const { blueprintId, instanceId } = useParams();

  const selectTab = React.useCallback(
    (id: string) => {
      const tab = tabs.find((t) => t.id === id);
      if (tab) {
        navigate(
          `${tab.blueprintId}${tab.instanceId ? `/${tab.instanceId}` : ""}`
        );
      }
    },
    [tabs]
  );

  const closeTab = React.useCallback(
    (id: string) => {
      const _tabs = Array.from(tabs);
      const index = _tabs.findIndex((t) => t.id === id);
      const tab = _tabs[index];

      if (tab.blueprintId === blueprintId && tab.instanceId === instanceId) {
        navigate("/");
      }

      _tabs.splice(index, 1);
      setTabs(_tabs);
    },
    [tabs, blueprintId, instanceId]
  );

  // Create or select tab when route changes
  React.useEffect(() => {
    if (blueprintId) {
      const existingTab = tabs.find(
        (t) => t.blueprintId === blueprintId && t.instanceId === instanceId
      );

      if (!existingTab) {
        const _tabs = Array.from(tabs);
        _tabs.push({ id: uuidv4(), blueprintId, instanceId });
        setTabs(_tabs);
      } else {
        selectTab(existingTab.id);
      }
    }
  }, [blueprintId, instanceId]);

  return (
    <div className="w-full h-[42px] bg-white border-b border-gray-300 drop-shadow-sm flex">
      <Cell>
        <Button
          link
          to="/"
          active={location.pathname === "/"}
          disabled={location.pathname === "/"}
          className="px-4 py-2"
          Icon={Icon.Book}
          label="Library"
          onClick={() => null}
        />
      </Cell>
      {/* Tabs */}
      <div className="w-full bg-gray-200 grid grid-cols-5">
        {tabs.map((t) => {
          const blueprint = blueprints.find((b) => b.id === t.blueprintId);
          const instance = instances.find((i) => i.id === t.instanceId);

          return (
            <div
              key={t.id}
              className={cx(
                "relative group h-[42px] px-4 py-2 bg-white border-b-2 border-transparent mr-[1px]",
                {
                  italic: !blueprint?.name,
                  "border-b-2 border-gray-900":
                    blueprintId === t.blueprintId &&
                    instanceId === t.instanceId,
                }
              )}
            >
              <div
                className="w-11/12 whitespace-nowrap overflow-hidden overflow-ellipsis cursor-pointer"
                onClick={() => selectTab(t.id)}
              >
                <span className="mr-1">{instance ? "[I]" : "[B]"}</span>
                {blueprint?.name ? blueprint.name : "New document"}
              </div>
              <div
                className={cx(
                  "absolute top-1/2 right-0 transform -translate-y-1/2",
                  "p-3 cursor-pointer"
                )}
                onClick={() => closeTab(t.id)}
              >
                <Icon.X size={16} />
              </div>
            </div>
          );
        })}
      </div>
      {/* <Cell>
        <Button
          link
          to="feedback"
          active={location.pathname === "/feedback"}
          disabled={location.pathname === "/feedback"}
          className="px-4 py-2"
          Icon={Icon.ChatRightDots}
          label="Feedback"
          onClick={() => null}
        />
      </Cell> */}
      {/* <Cell> */}
      {/*   <Button className="px-4 py-2" Icon={IconLogin} onClick={() => null} /> */}
      {/* </Cell> */}
      {/* <Cell> */}
      {/*   <Button */}
      {/*     className="px-4 py-2" */}
      {/*     Icon={IconMoonStars} */}
      {/*     onClick={() => null} */}
      {/*   /> */}
      {/* </Cell> */}
    </div>
  );
}

function Cell(props: { children: any }) {
  return (
    <div className="flex-shrink-0 border-r border-gray-300">
      {props.children}
    </div>
  );
}
