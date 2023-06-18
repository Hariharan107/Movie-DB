import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
// import StarRating from "../StarRating";
// const messages = ["Terrible", "Bad", "Okay", "Good", "Great"];

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <StarRating maxRating={5} messages={messages} /> */}

    <App />
  </React.StrictMode>
);
