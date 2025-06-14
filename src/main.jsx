// Import necessary libraries and modules
import { StrictMode } from "react"; // Enables strict mode checks in React
import { createRoot } from "react-dom/client"; // React's new root API for rendering
import "./index.css"; // Global styles for the app
import App from "./App.jsx"; // Main App component
import authReducer from "./state"; // Your custom reducer managing authentication state
import { configureStore } from "@reduxjs/toolkit"; // Simplified setup for Redux store
import { Provider } from "react-redux"; // Allows Redux store to be accessed by the app components
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist"; // Tools for persisting and rehydrating Redux state
import storage from "redux-persist/lib/storage"; // Uses localStorage for persistence
import { PersistGate } from "redux-persist/integration/react"; // Delays rendering of the app until the persisted state has been retrieved

// Configuration for persisting the Redux store
const persistConfig = {
  key: "root", // The key for the persisted data in storage
  storage, // Specifies the storage engine (localStorage here)
  version: 1, // Version of the persisted data
};

// Enhances the authReducer to make it persistable
const persistedReducer = persistReducer(persistConfig, authReducer);

// Sets up the Redux store with the persisted reducer
const store = configureStore({
  reducer: persistedReducer, // The combined reducer with persistence
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Middleware for handling actions and preventing serialization issues
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // Ignore persistence-related actions
      },
    }),
});

// Get the root DOM element to render the app
const root = createRoot(document.getElementById("root"));

// Render the app into the DOM
root.render(
  <StrictMode>
    {" "}
    {/* Enables React's strict checks in development mode */}
    <Provider store={store}>
      {" "}
      {/* Makes the Redux store available to the app */}
      <PersistGate loading={null} persistor={persistStore(store)}>
        {" "}
        {/* Delays rendering until the persisted state is ready */}
        <App /> {/* The main app component */}
      </PersistGate>
    </Provider>
  </StrictMode>
);