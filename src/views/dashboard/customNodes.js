import React from "react";
import { Handle } from "@xyflow/react";
import pole from "../../assets/images/electric-pole.png";
import gen from "../../assets/images/genset.png";
import solarpanel from "../../assets/images/solarpanell.png";
import load1 from "../../assets/images/load1.png";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

const iconMapping = {
  solar: (
    <img
      src="https://mexemai.com/bucket/ems/image/solarpanell.png"
      alt="Solar Panel"
      style={{
        width: "30px",
        height: "30px",
        marginBottom: "10px",
        filter:
          "invert(74%) sepia(36%) saturate(564%) hue-rotate(104deg) brightness(91%) contrast(85%)",
      }}
    />
  ),
  genset: (
    <img
      src="https://mexemai.com/bucket/ems/image/genset.png"
      alt="Genset"
      style={{
        width: "30px",
        height: "30px",
        marginBottom: "10px",
        filter:
          "invert(74%) sepia(36%) saturate(564%) hue-rotate(104deg) brightness(91%) contrast(85%)",
      }}
    />
  ),
  load: (
    <img
      src="https://mexemai.com/bucket/ems/image/load1.png"
      alt="Load"
      style={{
        width: "30px",
        height: "30px",
        marginBottom: "10px",
        filter:
          "invert(74%) sepia(36%) saturate(564%) hue-rotate(104deg) brightness(91%) contrast(85%)",
      }}
    />
  ),
  grid: (
    <img
      src="https://mexemai.com/bucket/ems/image/electric-pole.png"
      alt="Electric Pole"
      style={{
        width: "30px",
        height: "30px",
        marginBottom: "10px",
        filter:
          "invert(74%) sepia(36%) saturate(564%) hue-rotate(104deg) brightness(91%) contrast(85%)",
      }}
    />
  ),
};

// export default CustomNode;
const CustomNode = ({ data }) => {
  return (
    <div
      style={{
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: data.backgroundColor || "#0C101B",
        padding: 0,
      }}
    >
      {iconMapping[data.iconType]}
      {data.label && (
        <div style={{ fontSize: "14px", color: "#fff", textAlign: "center" }}>
        <ArrowForward fontSize="14px"/>
          {` ${data.label} W`}
        </div>
      )}
      {data.subLabel && (
        <div style={{ fontSize: "14px", color: "#fff", textAlign: "center" }}>
          <ArrowBack fontSize="14px"/>
          {`${data.subLabel} KW`}
        </div>
      )}
      <Handle
        type="target"
        position={data.incomingHandlePosition}
        id="incoming"
        style={{ borderRadius: "50%" }}
      />
      <Handle
        type="source"
        position={data.outgoingHandlePosition}
        id="outgoing"
        style={{ borderRadius: "50%" }}
      />
    </div>
  );
};

export default CustomNode;
