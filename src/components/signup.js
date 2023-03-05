import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { verificationCode, email, pass } from "../redux/actions";

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
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";

import EmailIcon from "@mui/icons-material/Email";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";

function SignUp() {
  const [icon, setIcon] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState("");
  const [display, setDisplay] = useState("flex");
  const [alertDisplay, setAlertDisplay] = useState("none");

  const url = "http://localhost:5000/";
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (event) => {
    setUserEmail(event.target.value);
  };

  const handleClickShowPassword = () => {
    setIcon(!icon);
  };

  const handleClickLogin = async () => {
    let userExists = false;
    if (users !== "") {
      users.map((a) => (a.email === userEmail ? (userExists = true) : ""));
    }
    console.log(userExists);
    if (userEmail !== "" && password !== "") {
      if (!userExists) {
        await axios(`${url}random`).then((res) =>
          dispatch(verificationCode(res.data.random))
        );
        console.log("working");
        await axios(`${url}email/${code}`)
          .then((res) => {
            if (res.status === 200) {
              setDisplay("none");
              setAlertDisplay("flex");
              dispatch(email(userEmail));
              dispatch(pass(password));
              navigate("/verification");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };
  const handleClickGoogle = async () => {
    // console.log("google +");
    // await axios
    //   .get(`http://localhost:5000/google`)
    //   .catch((err) => console.log(err));
  };
  const getUsers = async () => {
    await axios(`${url}users`)
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div
      style={{ backgroundColor: "#EEF1FF", heibht: "100vh", width: "100vw" }}
    >
      <Container maxWidth="md" sx={{ height: "100vh" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Paper elevation={4} sx={{ width: "100%" }}>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem />}
            >
              <div style={{ width: "50%" }}>
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
                    Sign Up
                  </Typography>
                  <TextField
                    required
                    id="input-with-icon-textfield"
                    label="Email"
                    fullWidth
                    autoComplete="off"
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
                      required
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
                  <Button
                    variant="contained"
                    sx={{
                      width: "60%",
                      letterSpacing: "0.3rem",
                      fontWeight: 700,
                      fontSize: "1.2rem",
                      display: display,
                    }}
                    onClick={handleClickLogin}
                  >
                    Sign Up
                  </Button>
                  <Alert
                    severity="success"
                    variant="outlined"
                    color="info"
                    sx={{ display: alertDisplay }}
                  >
                    Sign up in progress
                  </Alert>
                  <p>
                    Already have account?
                    <Link href="/login" underline="hover">
                      Login
                    </Link>
                  </p>
                </Stack>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "50%",
                }}
              >
                <Stack spacing={8}>
                  <Typography variant="h4" gutterBottom sx={{ color: "gray" }}>
                    Sign Up with google
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      width: "80%",
                      letterSpacing: "0.3rem",
                      fontWeight: 700,
                      fontSize: "1.2rem",
                      display: display,
                    }}
                  >
                    <a href="http://localhost:5000/google">Google +</a>
                  </Button>
                </Stack>
              </div>
            </Stack>
          </Paper>
        </Box>
      </Container>
    </div>
  );
}

export default SignUp;
