import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import { store } from "./Features/Store";
import { ThemeProviderWrapper } from "./components/ThemeContent/ThemeContext";
import { SocketProvider } from "./components/Socket/Socket";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProviderWrapper>
    <Provider store={store}>
      <SocketProvider>
        <App />
      </SocketProvider>
    </Provider>
    </ThemeProviderWrapper>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
