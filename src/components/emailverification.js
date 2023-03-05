import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

/* MATERIAL UI IMPORTS */
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";

function EmailVerification() {
  const [code, setCode] = useState(0);

  let navigate = useNavigate();
  const token = useSelector((state) => state.allUsers.code);
  const email = useSelector((state) => state.allUsers.email);
  const password = useSelector((state) => state.allUsers.pass);

  const url = "http://localhost:5000/";

  const handleClick = async () => {
    console.log(token, code);
    if (token === code) {
      await axios
        .post(`${url}user/add`, { email: email, password: password })
        .then((res) => navigate("/login"))
        .catch((err) => console.log(err));
    }
  };
  return (
    <div
      style={{ backgroundColor: "#EEF1FF", heibht: "100vh", width: "100vw" }}
    >
      <Container maxWidth="md" sx={{ height: "100vh" }}>
        <Box sx={{ display: "flex", alignItems: "center", height: "100vh" }}>
          <Paper elevation={4} sx={{ width: "100%" }}>
            <Stack
              spacing={4}
              p={4}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h2" gutterBottom>
                Email Verification
              </Typography>
              <TextField
                required
                variant="standard"
                label="Enter 4 digit Verification Code"
                fullWidth
                type="number"
                autoComplete="off"
                onChange={(e) => setCode(parseInt(e.target.value))}
              />
              <Button
                variant="contained"
                sx={{
                  width: "60%",
                  letterSpacing: "0.3rem",
                  fontWeight: 700,
                  fontSize: "1.2rem",
                }}
                onClick={handleClick}
              >
                Verify
              </Button>
              <p style={{ letterSpacing: "0.1rem", fontWeight: "bold" }}>
                An email has been sent to your email for verification.
              </p>
            </Stack>
          </Paper>
        </Box>
      </Container>
    </div>
  );
}

export default EmailVerification;
