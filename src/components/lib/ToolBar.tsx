import * as React from "react";
import cx from "classnames";
import Button from "./Button";
import { ArrowDownIcon, ArrowUpIcon, LockIcon, TrashIcon } from "./Icons";

type Props = {
  children?: any;
  show: boolean;
  containerRef: React.MutableRefObject<null>;
  removeSection?: () => void;
  moveSectionUp?: () => void;
  moveSectionDown?: () => void;
  toggleLockSection?: () => void;
};

export default function ToolBar(props: Props) {
  const {
    children,
    show,
    containerRef,
    removeSection,
    moveSectionUp,
    moveSectionDown,
    toggleLockSection,
  } = props;
  const [width, setWidth] = React.useState(0);
  const [fixedPosition, toggleFixedPosition] = React.useState(false);

  const handleWindowScroll = (e) => {
    if (containerRef.current) {
      const container: HTMLElement = containerRef.current;
      const rect = container.getBoundingClientRect();

      if (rect.y < 32) {
        toggleFixedPosition(true);
      } else {
        toggleFixedPosition(false);
      }
    }
  };

  React.useEffect(() => {
    window.addEventListener("scroll", handleWindowScroll);

    return () => {
      window.removeEventListener("scroll", handleWindowScroll);
    };
  }, []);

  React.useEffect(() => {
    if (containerRef.current) {
      const container: HTMLElement = containerRef.current;
      setWidth(container.clientWidth);
    }
  }, [containerRef.current]);

  return (
    <div
      style={{ width: `${width}px`, height: "32px" }}
      className={cx(
        "z-20 px-4 flex justify-between items-center bg-white drop-shadow-md",
        {
          "absolute transform -translate-y-full border border-b-0":
            !fixedPosition,
          "fixed top-0 border border-t-0": fixedPosition,
          "opacity-0 pointer-events-none": !show,
        }
      )}
    >
      <div className="flex items-center">{children}</div>
      <div className="flex items-center">
        <ToolBarButton
          className="mr-2"
          icon={ArrowUpIcon}
          onClick={moveSectionUp}
        />
        <ToolBarButton
          className={cx({ "mr-4": !!removeSection || !!toggleLockSection })}
          icon={ArrowDownIcon}
          onClick={moveSectionDown}
        />
        {!!toggleLockSection ? (
          <ToolBarButton
            className={cx({ "mr-4": !!removeSection })}
            icon={LockIcon}
            onClick={toggleLockSection}
          />
        ) : null}
        {!!removeSection ? (
          <ToolBarButton
            className="text-red-500 mr-0"
            icon={TrashIcon}
            onClick={() => {
              if (confirm("Are you sure you want to remove this section?")) {
                removeSection();
              }
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

export function ToolBarButton(props) {
  const { className, icon, onClick } = props;

  return (
    <div className={className}>
      <Button size="small" icon={icon} onClick={onClick} />
    </div>
  );
}
