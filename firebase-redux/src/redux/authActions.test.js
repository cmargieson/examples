import configureStore from "redux-mock-store";
import thunk from "redux-thunk";

import { resetError } from "./authActions";
import { AUTH_TYPES } from "./actionTypes";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("resetError()", () => {
  it("should dispatch AUTH_ERROR_RESET", () => {
    // Initialize mock store with empty state
    const initialState = {
      userReady: false,
      userModel: null,
      authError: null,
    };
    const store = mockStore(initialState);

    // Dispatch the action
    store.dispatch(resetError());

    // Test if your store dispatched the expected actions
    const actions = store.getActions();
    const expectedPayload = { type: AUTH_TYPES.AUTH_ERROR_RESET };
    expect(actions).toEqual([expectedPayload]);
    // Failing test
    // expect(actions).toEqual(42);
  });
});
