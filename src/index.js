import React from "react";
import ReactDOM from "react-dom";
// Components
import App from "./App";
// Utils
import * as serviceWorker from "./serviceWorker";
// Material UI
import CssBaseline from "@material-ui/core/CssBaseline";
// Redux
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import rootReducer from "./redux/reducers";
import { verifyAuth } from "./redux/authActions";

const store = createStore(rootReducer, applyMiddleware(thunk));

store.dispatch(verifyAuth());

ReactDOM.render(
  <Provider store={store}>
    <CssBaseline />
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
