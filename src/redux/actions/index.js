export const email = (data) => {
  return {
    type: "EMAIL",
    payload: data,
  };
};

export const pass = (data) => {
  return {
    type: "PASS",
    payload: data,
  };
};

export const token = (data) => {
  return {
    type: "TOKEN",
    payload: data,
  };
};

export const login = (data) => {
  return {
    type: "LOGIN",
    payload: data,
  };
};

export const verificationCode = (data) => {
  return {
    type: "CODE",
    payload: data,
  };
};
