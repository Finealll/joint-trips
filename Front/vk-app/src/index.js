import React from "react";
import ReactDOM from "react-dom";
import bridge from "@vkontakte/vk-bridge";
import App from "./App";

// Init VK Mini App
bridge.send("VKWebAppInit");
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

ReactDOM.render(<App />, document.getElementById("root"));
if (process.env.NODE_ENV === "development") {
  import("./eruda").then(({ default: eruda }) => {}); //runtime download
}
