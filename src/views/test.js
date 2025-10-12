import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Tree, TreeNode } from 'react-organizational-chart';
import "react-toastify/dist/ReactToastify.css";
import GatewayNode from "../../src/views/widgets/WidgetsDropdown";
import AssignmentIcon from '@mui/icons-material/Assignment'
import ContactlessIcon from '@mui/icons-material/Contactless';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CableIcon from '@mui/icons-material/Cable';

const chartData = {
  name: "Gateway",
  children: [
    {
      name: "COM1",
      children: [
        {
          name: "Analyzer",
          company: "Systems Company",
          ID: "1",
          purpose: "Grid",
          metadata: ["v1", "v2", "v3", "v4", "v5"]
        },
        {
          name: "Analyzer",
          company: "Systems Company",
          ID: "2",
          purpose: "Grid",
          metadata: ["v1", "v2", "v3", "v4", "v5"]
        }
      ]
    },
    {
      name: "COM2",
      children: [
        {
          name: "Analyzer",
          company: "Systems Company",
          ID: "3",
          purpose: "Genset",
          metadata: ["v1", "v2", "v3", "v4", "v5"]
        },
        {
          name: "Analyzer",
          company: "Systems Company",
          ID: "4",
          purpose: "Genset",
          metadata: ["v1", "v2", "v3", "v4", "v5"]
        }
      ]
    },
    {
      name: "ETH1",
      children: [
        {
          name: "Analyzer",
          company: "Systems Company",
          ID: "5",
          purpose: "Solar",
          metadata: ["v1", "v2", "v3", "v4", "v5"]
        },
        {
          name: "Analyzer",
          company: "Systems Company",
          ID: "6",
          purpose: "Solar",
          metadata: ["v1", "v2", "v3", "v4", "v5"]
        }
      ]
    },
    {
      name: "ETH2",
      children: [
        {
          name: "Analyzer",
          company: "Systems Company",
          ID: "7",
          purpose: "Solar",
          metadata: ["v1", "v2", "v3", "v4", "v5"]
        },
        {
          name: "Analyzer",
          company: "Systems Company",
          ID: "8",
          purpose: "Solar",
          metadata: ["v1", "v2", "v3", "v4", "v5"]
        }
      ]
    }
  ]
};
const getIconAndBgColor = (purpose) => {
  if (purpose === 'Gateway') {
    return {
      icon: <ContactlessIcon fontSize="large" />,
      bgColor: "linear-gradient(135deg, rgb(86, 95, 104), rgb(73, 13, 224))"
    };
  } else if ((purpose === 'COM1') || (purpose === 'COM2') || (purpose === 'ETH1') || (purpose === 'ETH2')) {
    return {
      icon: <CableIcon fontSize="large" />,
      bgColor: "linear-gradient(135deg, rgb(250, 150, 148), #E53935)"
    };
  } else if (purpose === 'Analyzer') {
    return {
      icon: <CalendarTodayIcon fontSize="large" />,
      bgColor: "linear-gradient(135deg, rgb(90, 124, 137), rgb(27, 143, 14))"
    };
  } else {
    return {
      icon: <ContactlessIcon fontSize="large" />,
      bgColor: "linear-gradient(135deg, rgb(200, 200, 200), rgb(160, 160, 160))"
    };
  }
};
 // Recursive function to render tree nodes
 const renderTree = (node) => {
  console.log(node.name)
  const { icon, bgColor } = getIconAndBgColor(node.name);
  return (
    <TreeNode
      label={
        <GatewayNode
          title={node.name}
          // subtitle={node.purpose}
          icon={icon}
          bgColor= {bgColor}
        />
      }
    >
      {node.children && node.children.length > 0 &&
        node.children.map((child) => renderTree(child))
      }
    </TreeNode>
  );
};
const test = () => {
  return (
    <Tree
    lineWidth={"2px"}
    lineColor={"green"}
    lineBorderRadius={"20px"}
    nodePadding={"20px"}
    label= {
      <GatewayNode
        title={"Project"}
        subtitle="Gateway Tree"
        icon={<PrecisionManufacturingIcon  fontSize="medium" />}
        bgColor="linear-gradient(135deg,rgb(204, 191, 147),rgb(238, 64, 37))" // Red
      />
    }
    >
     {renderTree(chartData)} {/* This renders the whole tree structure */}
  </Tree>
  );
};
export default test;