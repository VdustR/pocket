import "virtual:windi.css";
import App from "./App.svelte";
import "./root.css";

const app = new App({
  target: document.getElementById("app"),
});

export default app;
