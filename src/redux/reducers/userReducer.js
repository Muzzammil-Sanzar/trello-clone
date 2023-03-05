const initialSate = {
  email: null,
  password: null,
  isLogedIn: false,
  code: 0,
};

const UserReducer = (state = initialSate, action) => {
  switch (action.type) {
    case "EMAIL":
      return { ...state, email: action.payload };
    case "PASS":
      return { ...state, password: action.payload };
    case "LOGIN":
      return { ...state, isLogedIn: action.payload };
    case "CODE":
      return { ...state, code: action.payload };
    default:
      return state;
  }
};

export default UserReducer;
