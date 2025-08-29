import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import { store } from "./Features/Store";
import { ThemeProviderWrapper } from "./components/ThemeContent/ThemeContext";
import { ErrorProvider } from "./components/Errors/Errors";
import { SocketProvider } from "./components/Socket/Socket";
import DynamicView from "./components/DynamicView/DynamicView";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProviderWrapper>
        <SocketProvider>
          <ErrorProvider>
            <App />
          </ErrorProvider>
        </SocketProvider>
      </ThemeProviderWrapper>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
