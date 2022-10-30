import React, { Dispatch, SetStateAction } from "react";
import cx from "classnames";
import { v4 as uuidv4 } from "uuid";
import Button from "./lib/Button";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as Icon from "react-bootstrap-icons";

type Props = {
  documents: Types.Document[];
  instances: Types.Instance[];
  toggleDarkMode: () => void;
};

export default function TopBar(props: Props) {
  const { documents, instances, toggleDarkMode } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const { documentId, instanceId } = useParams();

  return (
    <div
      className={cx(
        "absolute z-10 top-0 w-full h-[42px] flex justify-between drop-shadow-lg",
        {
          "bg-white dark:bg-gray-800": !documentId && !instanceId,
          "bg-blue-400": documentId && !instanceId,
          "bg-yellow-400": instanceId,
        }
      )}
    >
      {/* <Cell>
        <Button
          link
          to="/"
          active={location.pathname !== "/feedback"}
          disabled={location.pathname !== "/feedback"}
          className="px-4 py-2"
          Icon={Icon.Book}
          label="Documents"
          onClick={() => null}
        />
      </Cell>
      <Cell>
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
      {/* <Cell>
        <Button className="px-4 py-2" Icon={IconLogin} onClick={() => null} />
      </Cell> */}
      <div className="flex">
        <Cell
          active={location.pathname === "/" || !!documentId || !!instanceId}
        >
          <Button
            className="px-4 py-2"
            Icon={Icon.Book}
            label="Documents"
            onClick={() => navigate("/")}
          />
        </Cell>
        <Cell active={location.pathname === "/feedback"}>
          <Button
            className="px-4 py-2"
            Icon={Icon.ChatHeart}
            label="Feedback"
            onClick={() => navigate("/feedback")}
          />
        </Cell>
      </div>
      <div className="flex">
        <Cell>
          <Button
            className="px-4 py-2"
            Icon={Icon.MoonStars}
            onClick={toggleDarkMode}
          />
        </Cell>
      </div>
    </div>
  );
}

function Cell(props: { active?: boolean; noBorder?: boolean; children: any }) {
  const { active, noBorder, children } = props;

  return (
    <div
      className={cx("flex-shrink-0 dark:border-gray-900", {
        "dark:bg-gray-900": active,
        "border-r": !noBorder,
      })}
    >
      {children}
    </div>
  );
}
