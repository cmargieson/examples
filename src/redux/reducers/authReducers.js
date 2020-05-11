import { AUTH_TYPES } from "../actionTypes";

const initialState = {
  userReady: false,
  userModel: null,
  authError: null,
};

const authenticationReducers = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_TYPES.AUTH_ERROR:
      return {
        ...state,
        userReady: true,
        authError: action.payload.authError,
      };

    case AUTH_TYPES.AUTH_ERROR_RESET:
      return {
        ...state,
        userReady: true,
        authError: null,
      };

    case AUTH_TYPES.AUTH_LOGOUT:
      return {
        ...state,
        userReady: true,
        userModel: null,
      };

    case AUTH_TYPES.AUTH_USER:
      return {
        ...state,
        userReady: true,
        userModel: action.payload.userModel,
      };

    default:
      return state;
  }
};

export default authenticationReducers;
