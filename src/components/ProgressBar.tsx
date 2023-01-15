import React, { useEffect, useState } from "react";
import cx from "classnames";

interface Props {
  process: Types.Process;
  instance: Types.Instance;
}

export default function ProgressBar(props: Props) {
  const { process, instance } = props;
  const [progressMarkers, setProgressMarkers] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const processElem = document.getElementById("process") as HTMLDivElement;
    const processHeight = processElem.scrollHeight;

    const _progressMarkers = process.steps.map((s) => {
      const stepElem = document.getElementById(s.id) as HTMLDivElement;
      const rect = stepElem.getBoundingClientRect();
      const height = rect.height;
      const state = instance.state[s.id] || {};

      return (
        <div
          key={`progress_${s.id}`}
          className={cx({
            "bg-yellow-300/50": s.required && !state.completed,
            "bg-lime-400/50": s.required && state.completed,
            "bg-blue-400/50":
              s.type !== "text" && !s.required && !state.completed,
          })}
          style={{ height: `${(height / processHeight) * 100}%` }}
        ></div>
      );
    });

    setProgressMarkers(_progressMarkers);
  }, [process, JSON.stringify(instance.state)]);

  return (
    <div className="w-1 flex-shrink-0 relative">
      <div className="w-1 fixed h-screen transform translate-x-full pointer-events-none">
        {progressMarkers.map((x) => x)}
      </div>
    </div>
  );
}
