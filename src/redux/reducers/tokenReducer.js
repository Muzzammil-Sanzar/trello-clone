const token = null;

const TokenReducers = (state = token, action) => {
    switch(action.type){
        case "TOKEN":
            return state = action.payload
        default:
            return state;
    }
}

export default TokenReducers