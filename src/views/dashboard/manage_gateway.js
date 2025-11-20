import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  TableContainer,
  Paper,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Button,
  TextField,
  useTheme,
} from '@mui/material'
import urls from '../../urls/urls'
import { Plus } from 'lucide-react'
import axios from 'axios'
import { ColorModeContext } from '../theme/ThemeContext'


// Modal Component with Bounce Effect
const Modal = ({ isOpen, onClose, onSave }) => {
  const [input1, setInput1] = useState('')
  const [input2, setInput2] = useState('')
  const theme = useTheme()
  if (!isOpen) return null

  const handleSave = () => {
    onSave(input1, input2)
    onClose()
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {/* Dialog Box with Bounce Animation */}
      <div className="modal-container" style={{ background: theme.palette.background.paper, }}>
        <h2 className="modal-heading" style={{ color: theme.palette.text.TextColor }}>Create Gateway</h2>
        <div className="modal-content">
          {/* Text Field 1 */}
          <div className="input-group">
            <label className="input-label" style={{ color: theme.palette.text.TextColor }}>Gateway Name</label>
            <input
              type="text"
              value={input1}
              onChange={(e) => setInput1(e.target.value)}
              className="input-field"
              placeholder="Enter Gateway Name"
            />
          </div>
          {/* Text Field 2 */}
          <div className="input-group">
            <label className="input-label" style={{ color: theme.palette.text.TextColor }}>MAC Address</label>
            <input
              type="text"
              value={input2}
              onChange={(e) => setInput2(e.target.value)}
              className="input-field"
              placeholder="Enter MAC Address"
            />
          </div>
        </div>
        {/* Buttons */}
        <div className="modal-actions">
          <button onClick={onClose} className="modal-button cancel-button">
            Cancel
          </button>
          <button onClick={handleSave} className="modal-button save-button">
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

const ManageGateway = () => {
  const [gateways, setGateways] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false) // State for modal visibility
  const [searchTerm, setSearchTerm] = useState('')
  const theme = useTheme()



  const fetchAllHardware = async () => {
    try {
      const response = await axios.get(urls.totalGateways);
      console.log("✅ API Response:", response.data);

      // ✅ FIX: handle both Gateways / gateways
      const gatewaysData = response.data.Gateways || response.data.gateways;
      console.log("📦 Extracted Gateways:", gatewaysData);

      if (!Array.isArray(gatewaysData)) {
        console.error("❌ gateways is not an array:", response.data);
        setGateways([]);
        return;
      }

      const transformedHardware = gatewaysData.map((item) => {
        let deployStatus = "Warehouse";
        if (item.deploy_status === "user_aloted") deployStatus = "Assigned to User";
        else if (item.deploy_status === "deployed") deployStatus = "Deployed to User";

        return {
          id: item.G_id,
          gateway_name: item.gateway_name,
          mac_address: item.mac_address,
          status: item.status,
          deploy_status: deployStatus,
          created_by_id: item.created_by_id,
          admin_image: item.admin_image,
        };
      });

      console.log("🧾 Final Table Data:", transformedHardware);
      setGateways(transformedHardware);
    } catch (error) {
      console.error("❌ Error fetching gateways:", error);
    }
  };


  useEffect(() => {
    fetchAllHardware();

    // ✅ Auto refresh every 5 seconds
    const intervalId = setInterval(fetchAllHardware, 5000);
    return () => clearInterval(intervalId);
  }, []);


  // Handle Save in Modal
  const handleSave = async (gatewayName, macAddress) => {
    try {
      const response = await axios.post(urls.createGateway, {
        gateway_name: gatewayName,
        mac_address: macAddress,
      })

      if (response.data.success) {
        fetchAllHardware()
      } else {
        console.error('Failed to create gateway:', response.data.message)
      }
    } catch (error) {
      console.error('Error creating gateway:', error)
    }
  }

  return (
    <div className="w-full">
      {/* Row Layout */}
      <div
        className="flex justify-between items-center border-b py-3 px-4"
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        {/* Left Column */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold">Warehouse</h2>
          <p className="text-gray-600">Managing the Gateways</p>
        </div>


      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // Close modal
        onSave={handleSave} // Handle save action
      />

      <Box sx={{ padding: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 2,
            background: 'linear-gradient(135deg, rgb(103, 182, 247), rgb(50, 120, 185))',
            padding: '10px',
            borderRadius: '8px',
          }}
        >
          {/* Left: Heading */}
          <Typography variant="h5">Gateway</Typography>

          {/* Right: Search Bar */}
          <TextField
            variant="outlined"
            placeholder="Search"
            size="small"
            sx={{ width: '250px', background: theme.palette.background.paper, border: 'none', borderRadius: "4px" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>

        {/* ✅ Sorting Logic - Search Matches Appear on Top */}
        {(() => {
          const lowerSearchTerm = searchTerm.toLowerCase()

          const filteredGateways = gateways.filter((gateway) => {
            const nameMatch = gateway.gateway_name?.toLowerCase().includes(lowerSearchTerm);
            const macMatch = gateway.mac_address?.toLowerCase().includes(lowerSearchTerm);
            const statusMatch = gateway.deploy_status?.toLowerCase().includes(lowerSearchTerm);

            return nameMatch || macMatch || statusMatch;
          });


          return (
            <TableContainer
              component={Paper}
              sx={{
                marginTop: 2,
                width: '100%',
                overflow: 'auto'
              }}
            >
              <Table sx={{ minWidth: 600 }}>
                <TableHead>
                  <TableRow sx={{ background: theme.palette.background.paper }}>
                    <TableCell align="center" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                      ID
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                      Gateway Name
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                      MAC Address
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                      Deployment Status
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                      Created By
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredGateways.length > 0 ? (
                    filteredGateways.map((gateway) => (
                      <TableRow key={gateway.id}>
                        <TableCell align="center">{gateway.id}</TableCell>
                        <TableCell align="center">{gateway.gateway_name}</TableCell>
                        <TableCell align="center">{gateway.mac_address}</TableCell>
                        <TableCell align="center">
                          <Box display="flex" justifyContent="center">
                            <Button
                              variant="contained"
                              size="small"
                              disableElevation
                              disableRipple
                              sx={{
                                backgroundColor:
                                  gateway.deploy_status === 'Deployed to User'
                                    ? 'rgb(48, 207, 48)'
                                    : gateway.deploy_status === 'Assigned to User'
                                      ? '#2337cb'
                                      : '#ff2c2c',
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: 600,
                                boxShadow: 'none',
                                pointerEvents: 'none',
                                cursor: 'default',
                                minWidth: '120px',
                                '&:hover': {
                                  backgroundColor:
                                    gateway.deploy_status === 'Deployed to User'
                                      ? 'rgb(48, 207, 48)'
                                      : gateway.deploy_status === 'Assigned to User'
                                        ? '#2337cb'
                                        : '#ff2c2c',
                                  boxShadow: 'none',
                                },
                              }}
                            >
                              {gateway.deploy_status}
                            </Button>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                            {gateway.admin_image && (
                              <img
                                src={gateway.admin_image || "https://via.placeholder.com/40"}
                                alt="User Avatar"
                                style={{
                                  width: 30,
                                  height: 30,
                                  borderRadius: '50%',
                                  objectFit: 'cover',
                                }}
                              />
                            )}
                            {gateway.created_by_id}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )
        })()}
      </Box>

      {/* Add CSS Styles */}
      <style>
        {`
          /* Modal Container */
          .modal-container {
            background: white;
            padding: 24px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            width: 400px;
            animation: bounce-in 0.3s ease-out;
          }

          /* Modal Heading */
          .modal-heading {
            font-size: 1.5rem;
            font-weight: 600;
            color: #1a1a1a;
            text-align: center;
            margin-bottom: 20px;
          }

          /* Modal Content */
          .modal-content {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          /* Input Group */
          .input-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          /* Input Label */
          .input-label {
            font-size: 0.875rem;
            font-weight: 500;
            color: #4a5568;
          }

          /* Input Field */
          .input-field {
            padding: 10px 12px;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            font-size: 0.875rem;
            color: #1a1a1a;
            outline: none;
            transition: border-color 0.2s;
          }

          .input-field:focus {
            border-color: #3182ce;
            box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.2);
          }

          /* Modal Actions */
          .modal-actions {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            margin-top: 20px;
          }

          /* Modal Buttons */
          .modal-button {
            padding: 10px 22px;
            border-radius: 6px;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s, transform 0.2s;
          }

          .cancel-button {
            background: #f0f0f0;
            color: #4a5568;
          }

          .cancel-button:hover {
            background: #e2e8f0;
          }

          .save-button {
            background: #3182ce;
            color: white;
          }

          .save-button:hover {
            background: #2c5282;
          }

          /* Bounce Animation */
          @keyframes bounce-in {
            0% {
              transform: scale(0.5);
              opacity: 0;
            }
            60% {
              transform: scale(1.1);
              opacity: 1;
            }
            100% {
              transform: scale(1);
            }
          }
        `}
      </style>
    </div>
  )
}

export default ManageGateway
