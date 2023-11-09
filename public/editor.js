/**
 * @typedef {{
 *   htmlEl: HTMLTextAreaElement
 *   cssEl: HTMLTextAreaElement
 *   jsEl: HTMLTextAreaElement
 *   outputEl: HTMLOutputElement
 *   parser: DOMParser
 *   localStorageKey: string
 * }} EditorConfig
 *
 * @param {Partial<EditorConfig>} config
 */
export function createEditor(config = {}) {
  const { htmlEl, cssEl, jsEl, outputEl, parser, localStorageKey } = {
    ...getDefaultEditorConfig(),
    ...config,
  };

  return {
    render() {
      const doc = parser.parseFromString(
        `
          <html>
            <head>
              <style>${cssEl.value}</style>
              <script>${jsEl.value}<\/script>
            </head>
            <body>${htmlEl.value}</body>
          </html>
        `,
        "text/html"
      );

      const iframe = document.createElement("iframe");
      iframe.srcdoc = doc.documentElement.outerHTML;
      outputEl.replaceChildren(iframe);
    },
    load() {
      const item = localStorage.getItem(localStorageKey);
      if (!item) {
        return;
      }
      const state = JSON.parse(item);
      htmlEl.value = state.html;
      cssEl.value = state.css;
      jsEl.value = state.js;
    },
    save() {
      localStorage.setItem(
        localStorageKey,
        JSON.stringify({
          html: htmlEl.value,
          css: cssEl.value,
          js: jsEl.value,
        })
      );
    },
  };
}

/**
 * @returns {EditorConfig}
 */
export function getDefaultEditorConfig() {
  const htmlEl = document.getElementById("html");
  if (!(htmlEl instanceof HTMLTextAreaElement)) {
    throw new Error("HTML editor must be a <textarea />");
  }
  const cssEl = document.getElementById("css");
  if (!(cssEl instanceof HTMLTextAreaElement)) {
    throw new Error("CSS editor must be a <textarea />");
  }
  const jsEl = document.getElementById("js");
  if (!(jsEl instanceof HTMLTextAreaElement)) {
    throw new Error("JS editor must be a <textarea />");
  }
  const outputEl = document.getElementById("output");
  if (!(outputEl instanceof HTMLOutputElement)) {
    throw new Error("editor ouput must be an <output />");
  }
  const parser = new DOMParser();
  const localStorageKey = "state";
  return { htmlEl, cssEl, jsEl, outputEl, parser, localStorageKey };
}
