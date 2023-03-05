import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { token, login } from "../redux/actions";

/* MATERIAL UI IMPORTS */
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";

import EmailIcon from "@mui/icons-material/Email";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";

function Login() {
  const [icon, setIcon] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  const handleClickShowPassword = () => {
    setIcon(!icon);
  };

  const handleClickLogin = async () => {
    await axios(`http://localhost:5000/getUser/${email}/${password}`)
      .then((res) => {
        if (res.status === 200 && res.data != null) {
          dispatch(token(res.data.token));
          dispatch(login(true));
          // console.log(res.data.token)
          navigate("/home");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div
      style={{ backgroundColor: "#16213E", heibht: "100vh", width: "100vw" }}
    >
      <Container maxWidth="sm" sx={{ height: "100vh" }}>
        <Box sx={{ display: "flex", alignItems: "center", height: "100vh" }}>
          <Paper elevation={4} sx={{ width: "100%" }}>
            <Stack
              spacing={2}
              p={4}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#EEF1FF",
              }}
            >
              <Typography variant="h2" gutterBottom>
                Log In
              </Typography>
              <TextField
                required
                id="input-with-icon-textfield"
                label="Email"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
                onChange={handleChange}
              />
              <FormControl sx={{ width: "100%" }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={!icon ? "text" : "password"}
                  fullWidth
                  onChange={(e) => setPassword(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {icon ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
              <Button variant="contained" onClick={handleClickLogin}>
                Login
              </Button>
              <p>
                Create account{" "}
                <Link href="/signup" underline="hover">
                  Sign Up
                </Link>
              </p>
            </Stack>
          </Paper>
        </Box>
      </Container>
    </div>
  );
}

export default Login;
