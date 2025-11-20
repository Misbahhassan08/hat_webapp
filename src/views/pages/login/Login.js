import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo2 from "../../../assets/images/logo2.png";
import frame1 from "../../../assets/images/profile.svg";
import urls from "../../../urls/urls";
import { useAuth } from "../../../Context/AuthContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveuserId, setSaveUserId] = useState("");
  const [isForgot, setIsForgot] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // --- Handle Login ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please fill in all fields");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email))
      return toast.error("Please enter a valid email address.");

    setLoading(true);
    try {
      const response = await axios.post(urls.loginUser, { email, password });
      const {
        success,
        user_id,
        firstname,
        lastname,
        role,
        image,
        unique_key,
        contact,
        adress,
        zip_code,
        access,
        refresh,
      } = response.data;

      if (success) {
        login({
          user_id,
          firstname,
          lastname,
          role,
          image,
          unique_key,
          email,
          contact,
          adress,
          zip_code,
          access,
          refresh,
        });
        localStorage.setItem("role", role);
        localStorage.setItem("user_id", user_id);
        localStorage.setItem("access", access);
        localStorage.setItem("refresh", refresh);
        toast.success("Login successful!");
        navigate("/dashboard/project_data");
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

  // --- Send OTP ---
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your registered email address");

    setLoading(true);
    try {
      const response = await axios.post(urls.sentEmailreset, { email });
      if (response.data.success) {
        toast.success("OTP sent to your email!");
        setOtpSent(true);
      } else {
        toast.error(response.data.message || "Email not found!");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Error sending OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- Verify OTP ---
  const handleVerifyOtp = async () => {
    if (!otp) return toast.error("Please enter the OTP first.");
    setLoading(true);
    try {
      const response = await axios.post(urls.verifyOtp, { code: otp });
      if (response.data.success) {
        toast.success("OTP verified successfully!");
        setOtpSent("verified");
        setSaveUserId(response.data.user_id);
      } else {
        toast.error(response.data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Something went wrong while verifying OTP.");
    } finally {
      setLoading(false);
    }
  };

  // --- Update Password ---
  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword)
      return toast.error("Please fill in both fields.");
    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match.");

    setLoading(true);
    
    try {
      const response = await axios.post(
        urls.updateUser(saveuserId),
        { password: newPassword }
      );

      console.log("Update password response:", response.data); // Debug log

      // ✅ FIXED: Check for message instead of success field
      if (response.data.message === "User updated successfully") {
        // ✅ Set password updated success state
        setPasswordUpdated(true);
        
        // Wait for 2 seconds to show "Password updated" message, then reset everything
        setTimeout(() => {
          // ✅ Reset all states to return to login form
          setIsForgot(false);
          setOtpSent(false);
          setOtp("");
          setNewPassword("");
          setConfirmPassword("");
          setEmail("");
          setPassword("");
          setSaveUserId("");
          setPasswordUpdated(false);
        }, 2000);
        
      } else {
        toast.error(response.data.message || "Failed to update password.");
      }
    } catch (err) {
      console.error("Error updating password:", err);
      toast.error("Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container component="main" sx={{ height: "100vh", bgcolor: "white" }}>
      {/* Left Side */}
      <Grid
        item
        xs={12}
        sm={5}
        md={5}
        sx={{
          background:
            "linear-gradient(135deg, rgb(52, 109, 223), rgb(124, 171, 241))",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: 3,
          position: "relative",
          overflow: "hidden",
          borderTopRightRadius: { md: "30px", xs: "0px" },
          borderBottomRightRadius: { md: "30px", xs: "30px" },
          borderBottomLeftRadius: { md: "0px", xs: "30px" },
          boxShadow: {
            xs: "0px 10px 20px rgba(80, 134, 241, 0.5)",
            md: "15px 0px 30px rgba(79, 133, 241, 0.5)",
          },
        }}
      >
        <Typography variant="h4" color="white" fontWeight="bold" mb={"18px"}>
          Let's Get Started
        </Typography>
        <Box
          component="img"
          src={logo2}
          alt="Login Illustration"
          sx={{ width: "60%", maxWidth: 200, objectFit: "contain", mt: "10px" }}
        />
      </Grid>

      {/* Right Side */}
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
        <Box
          sx={{
            width: "80%",
            maxWidth: 400,
            textAlign: "center",
            borderRadius: "8px",
            padding: "20px",
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.1)",
          }}
        >
          <img
            src={frame1}
            alt="Profile"
            style={{
              width: "40%",
              height: "auto",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
          />

          {/* ✅ Conditionally show login or forgot password form */}
          {!isForgot ? (
            <>
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
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon style={{ color: "black" }} />
                      </InputAdornment>
                    ),
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
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 4,
                    mb: 2,
                    backgroundColor: "#0066ff",
                    "&:hover": { backgroundColor: "#0044cc" },
                  }}
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>

                <Button fullWidth onClick={() => setIsForgot(true)}>
                  Forget Password
                </Button>
              </form>
            </>
          ) : (
            <>
              <Typography variant="h5" fontWeight="bold" color={"black"} gutterBottom>
                Forgot Password
              </Typography>

              {/* Step 1: Enter Email */}
              {!otpSent && (
                <>
                  <TextField
                    label="Enter Email Address"
                    fullWidth
                    margin="normal"
                    variant="standard"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={handleSendOTP}
                    disabled={loading}
                  >
                    {loading ? "Sending OTP..." : "Send OTP via Email"}
                  </Button>
                </>
              )}

              {/* Step 2: Enter OTP */}
              {otpSent === true && (
                <>
                  <TextField
                    label="Enter OTP"
                    fullWidth
                    margin="normal"
                    variant="standard"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={handleVerifyOtp}
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </Button>
                </>
              )}

              {/* Step 3: Reset Password */}
              {otpSent === "verified" && (
                <>
                  <TextField
                    label="New Password"
                    fullWidth
                    margin="normal"
                    variant="standard"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <TextField
                    label="Confirm New Password"
                    fullWidth
                    margin="normal"
                    variant="standard"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {/* ✅ FIXED: Button shows "Password updated" when successful */}
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ 
                      mt: 2,
                      backgroundColor: passwordUpdated ? "#4CAF50" : "#0066ff",
                      "&:hover": { 
                        backgroundColor: passwordUpdated ? "#45a049" : "#0044cc",
                      },
                      "&.Mui-disabled": {
                        backgroundColor: passwordUpdated ? "#4CAF50" : "",
                        color: passwordUpdated ? "white" : ""
                      }
                    }}
                    onClick={handleUpdatePassword}
                    disabled={loading || passwordUpdated}
                  >
                    {passwordUpdated ? "✓ Password updated" : (loading ? "Updating..." : "Update Password")}
                  </Button>
                </>
              )}

              <Button fullWidth sx={{ mt: 2 }} onClick={() => setIsForgot(false)}>
                Back to Login
              </Button>
            </>
          )}
        </Box>
      </Grid>
      <ToastContainer />
    </Grid>
  );
};

export default Login;