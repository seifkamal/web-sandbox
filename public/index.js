import { createEditor } from "./editor.js";

window.addEventListener("DOMContentLoaded", () => {
  const editor = createEditor();

  editor.load();
  editor.render();

  window.addEventListener("change", () => {
    editor.save();
    editor.render();
  });
});
