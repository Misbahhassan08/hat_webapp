import React from 'react';
import { BaseEdge, getBezierPath } from '@xyflow/react';
import { useTheme } from '@mui/material';

function AnimatedSVGEdge({
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

  const theme = useTheme()
  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <svg style={{ overflow: 'visible' }}>
        <path id={`edge-path-${id}`} d={edgePath} fill="transparent" />
        <circle r="5" fill= {theme.palette.circle.paper}>
          <animateMotion dur="4s" repeatCount="indefinite">
            <mpath href={`#edge-path-${id}`} />
          </animateMotion>
        </circle>
      </svg>
    </>
  );
}

export default React.memo(AnimatedSVGEdge);
