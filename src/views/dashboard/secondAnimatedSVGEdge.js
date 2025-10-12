import React from "react";
import { BaseEdge, getBezierPath } from "@xyflow/react";
function SecondAnimatedSVGEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <circle r="10" fill="#3da58a">
        <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} />
      </circle>
    </>
  );
}

export default SecondAnimatedSVGEdge;
