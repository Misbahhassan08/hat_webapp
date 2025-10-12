import React from 'react';

// ReactPieSegment Component (Individual Pie Slice)
const ReactPieSegment = ({ centre, fillColor, strokeColor, start, delta, rIn, rOut, label }) => {
  // Generate Path for each segment (pie slice)
  const generatePathDef = (centre, rIn, rOut, start, delta) => {
    const endRad = start + delta;
    
    const startOut = {
      x: centre.x + rOut * Math.cos(start),
      y: centre.y + rOut * Math.sin(start)
    };

    const endOut = {
      x: centre.x + rOut * Math.cos(endRad),
      y: centre.y + rOut * Math.sin(endRad)
    };

    const startIn = {
      x: centre.x + rIn * Math.cos(endRad),
      y: centre.y + rIn * Math.sin(endRad)
    };

    const endIn = {
      x: centre.x + rIn * Math.cos(start),
      y: centre.y + rIn * Math.sin(start)
    };

    const largeArc = delta > Math.PI ? 1 : 0;

    return (
      `M${startOut.x},${startOut.y}` +
      ` A${rOut},${rOut} 0 ` +
      `${largeArc},1 ${endOut.x},${endOut.y}` +
      ` L${startIn.x},${startIn.y}` +
      ` A${rIn},${rIn} 0 ` +
      `${largeArc},0 ${endIn.x},${endIn.y}` +
      ` L${startOut.x},${startOut.y} Z`
    );
  };

  // Calculate label position
  const labelDist = rIn + 1.2 * (rOut - rIn);
  const labelRad = start + 0.5 * delta;

  const labelPos = {
    x: centre.x + labelDist * Math.cos(labelRad) - 10,
    y: centre.y + labelDist * Math.sin(labelRad)
  };

  const labelStyle = {
    transform: `translate(${labelPos.x}px, ${labelPos.y}px)`
  };

  // Generate path definition for the segment
  const pathDef = generatePathDef(centre, rIn, rOut, start, delta);

  return (
    <g className="react-pie-segment">
      <path stroke={strokeColor} fill={fillColor} d={pathDef} />
      <text style={labelStyle}>{label}</text>
    </g>
  );
};

// Speedometer Component (With Needle)
const Speedometer = ({ needleAngle, arrowSize = 5, needleLength = 20 }) => {  // Needle length is reduced to 20
  const centre = { x: 100, y: 100 };
  const rIn = 40;
  const rOut = 70;

  // Dummy Data for the segments
  const segments = [
    { fillColor: 'green', strokeColor: 'green', start: Math.PI, delta: Math.PI / 4,  },
    { fillColor: 'yellow', strokeColor: 'yellow', start: 5 * Math.PI / 4, delta: Math.PI / 4,},
    { fillColor: 'orange', strokeColor: 'orange', start: 6 * Math.PI / 4, delta: Math.PI / 4,},
    { fillColor: 'red', strokeColor: 'red', start: 7 * Math.PI / 4, delta: Math.PI / 4,}
  ];

  // Needle Position Calculation
  const needleX = centre.x + needleLength * Math.cos(needleAngle);
  const needleY = centre.y + needleLength * Math.sin(needleAngle);

  return (
    <div className="speedometer">
      <svg width="250" height="150" viewBox="0 0 300 300">
        {/* Render Pie Segments */}
        {segments.map((segment, idx) => (
          <ReactPieSegment
            key={idx}
            centre={centre}
            strokeColor={segment.strokeColor}
            fillColor={segment.fillColor}
            delta={segment.delta}
            start={segment.start}
            label={segment.label}
            rIn={rIn}
            rOut={rOut}
          />
        ))}
        
        {/* Render Needle */}
        <line
          x1={centre.x}
          y1={centre.y}
          x2={needleX}
          y2={needleY}
          stroke="black"
          strokeWidth="3"
          markerEnd="url(#arrowhead)" // Optional: Adds an arrowhead to the needle
        />
        
        {/* Arrowhead with adjustable size */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth={arrowSize}   // Controls the size of the arrow
            markerHeight={arrowSize}  // Controls the size of the arrow
            refX={arrowSize / 2}      // Adjust position of the arrowhead
            refY={arrowSize / 2}      // Adjust position of the arrowhead
            orient="auto"
          >
            <polygon
              points={`0,0 ${arrowSize},${arrowSize / 2} 0,${arrowSize}`}  // Adjust these values to change arrow size
              fill="black"
            />
          </marker>
        </defs>
      </svg>
    </div>
  );
};

// Main Component (Parent component to render Speedometer)
const GuageMeter = () => {
  // You can pass different needle angles based on your needs
  return (
    <div className="app">
    
      <Speedometer needleAngle={180} needleLength={60} />

    </div>
  );
};

export default GuageMeter;
