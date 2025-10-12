import React from 'react';
import { Handle, Position } from '@xyflow/react';



const SecondCustomNode = ({ data }) => {
  return (
    <div
      style={{
        width: '210px',
        height: '250px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start', // Align items to start from top
        backgroundColor: data.backgroundColor || "#1E1E2F",
        borderRadius: '10px',
        color: '#FFFFFF',
        padding: '10px', 
      }}
    >
      {/* Display image at the top */}
      {data.imageSrc ? (
        <img 
          src={data.imageSrc} 
          alt={data.label || 'Node Image'} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
          
          }}
        />
      ) 
      : 
      (
        <div style={{ color: '#E0E0E0', marginBottom: '10px' }}></div>
      )
      }

      {/* Display label below the image */}
      <div 
        style={{ 
          fontSize: '25px', 
          // fontWeight: 'bold', 
          color: '#E0E0E0', 
          textAlign: 'center', 
          marginBottom: '2px' // Margin below the label
        }}
      >
        {data.label || 'No Label'}
      </div>
      
      {/* Display sub-label below the label */}
      <div 
        style={{ 
          fontSize: '25px',
          fontWeight:'bold', 
          color: '#B0BEC5', 
          textAlign: 'center'
        }}
      >
        {data.subLabel || ''}
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        id="incoming"
        style={{ borderRadius: '50%' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="outgoing"
        style={{ borderRadius: '50%' }}
      />
    </div>
  );
};

export default SecondCustomNode;
