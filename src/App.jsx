/* eslint-disable react/jsx-no-comment-textnodes */
import React from "react";
import { AvatarEditorDialogProvider } from "./components/AvatarEditorDialog/AvatarEditorDialogContext";

import { Toaster } from "react-hot-toast";
import Routes from "./routes/router";
// import "./App.css";

function App() {
  return (
    <AvatarEditorDialogProvider>
      <Toaster />
         <Routes/>
      </AvatarEditorDialogProvider>
  );
}

export default App;
