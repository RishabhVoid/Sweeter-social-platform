// import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { Provider } from "react-redux";
import { persistor, store } from "./setup/store/index.ts";
import { PersistGate } from "redux-persist/integration/react";
import CustomAlertPrompt from "./common/components/customPrompts/CustomAlertPrompt/index.tsx";
import AppContextProvider from "./setup/context/index.tsx";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CustomChoicesPromt from "./common/components/customPrompts/CustomChoicesPrompt/index.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // Strict mode was truned off to integrate socket.io, multiple connections were a problem.
  // <React.StrictMode>
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
      <AppContextProvider>
        <CustomAlertPrompt />
        <CustomChoicesPromt />
        <DndProvider backend={HTML5Backend}>
          <App />
        </DndProvider>
      </AppContextProvider>
    </PersistGate>
  </Provider>
  // </React.StrictMode>
);
