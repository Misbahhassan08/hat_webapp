import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Grid, TextField, Button, Typography, Box, Paper } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo2 from '../../../assets/images/logo2.png';
import frame1 from "../../../assets/images/profile.svg";
import urls from "../../../urls/urls";
import { InputAdornment } from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useAuth } from '../../../Context/AuthContext';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(""); 
  const navigate = useNavigate();
  const { login } = useAuth();


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(urls.loginUser, { email, password });
      const { success, user_id, firstname, lastname, role, image, unique_key, contact,
        adress,
        zip_code,
        access, 
        refresh, 
         } = response.data;

         console.log('Response data:', response.data)


      if (success) {
        setRole(role); 

        login({
          user_id, firstname, lastname, role, image, unique_key, email, contact, adress, zip_code,  access, 
          refresh, 
        });
        
        toast.success("Login successful!");

        if (role === "admin") {
          navigate("/dashboard/project_data");
        } 
        else if (role === "user") {
          navigate("/dashboard/project_data");
        } 
        else {
          navigate("/dashboard/SuperAdminDashboard");
        }

        
      } else {
        toast.error(response.data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container component="main" sx={{ height: "100vh", bgcolor: "white" }}>
  
      <Grid
        item
        xs={12}
        sm={5}
        md={5}
        sx={{
          background: "linear-gradient(135deg, rgb(52, 109, 223), rgb(124, 171, 241))",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: 3,
          position: "relative", // Required for pseudo-element
          overflow: "hidden", // Prevents shadow from affecting white border areas
          borderTopRightRadius: { md: "30px", xs: "0px" },
          borderBottomRightRadius: { md: "30px", xs: "30px" },
          borderBottomLeftRadius: { md: "0px", xs: "30px" },
          boxShadow: {
            xs: "0px 10px 20px rgba(80, 134, 241, 0.5)", // Bottom shadow for mobile
            md: "15px 0px 30px rgba(79, 133, 241, 0.5)", // Right shadow for large screens
          },
          "&::after": {
            content: '""',
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "white",
            borderRadius: "inherit",
            top: 0,
            left: 0,
            zIndex: -1,
          },
        }}
      >
        {/* Heading */}
        <Typography variant="h4" color="white" fontWeight="bold" mb={"18px"}>
          Let's Get Started
        </Typography>

        {/* Image */}
        <Box
          component="img"
          src={logo2}
          alt="Login Illustration"
          sx={{
            width: "60%",
            maxWidth: 200,
            objectFit: "contain",
            mt: "10px",
          }}
        />
      </Grid>

      {/* Right Side Form */}
      <Grid
        item
        xs={12}
        sm={7}
        md={7}
        square
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Nested Box with Gradient Border */}
        <Box
          sx={{
            width: "80%",
            maxWidth: 400,
            textAlign: "center",
            borderRadius: "8px",
            backgroundClip: "padding-box",
            padding: "20px",
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.1)",
          }}
        >
          <img
            src={frame1}
            alt="Image description"
            style={{
              width: "40%",
              height: "auto",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          />

          <Typography variant="h5" fontWeight="bold" color={"black"} gutterBottom>
            Login to Your Account
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="E-mail Address"
              fullWidth
              margin="normal"
              variant="standard"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputLabelProps={{
                style: { color: "black" },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon style={{ color: "black" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiInput-underline:before": { borderBottomColor: "black" },
                "& .MuiInput-underline:hover:before": { borderBottomColor: "black" },
                "& .MuiInput-underline:after": { borderBottomColor: "black" },
              }}
            />

            <TextField
              label="Password"
              fullWidth
              margin="normal"
              variant="standard"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputLabelProps={{
                style: { color: "black" },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon style={{ color: "black" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Visibility
                      sx={{ cursor: "pointer", color: "black" }}
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiInput-underline:before": { borderBottomColor: "black" },
                "& .MuiInput-underline:hover:before": { borderBottomColor: "black" },
                "& .MuiInput-underline:after": { borderBottomColor: "black" },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 4,
                mb: 4,
                backgroundColor: "#0066ff",
                color: "#fff",
                "&:hover": { backgroundColor: "#0044cc" },
              }}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Box>
      </Grid>

      <ToastContainer />
    </Grid>
  );
};

export default Login;
