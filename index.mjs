import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import { inputRules, wrappingInputRule } from "prosemirror-inputrules";

import { gateSchema, exampleDoc } from "./schema.mjs";
import { showYaml, showPreview } from "./render.mjs";
import map from "./keymap.mjs";

window.view = new EditorView(document.querySelector("#editor"), {
  state: EditorState.create({
    doc: exampleDoc,
    plugins: [
      inputRules({
        rules: [wrappingInputRule(/^\s*([-*])\s$/, gateSchema.nodes.list)],
      }),
      keymap(map),
      keymap(baseKeymap),
      showYaml(document.querySelector("#result")),
      showPreview(document.querySelector("#preview")),
    ],
  }),
});
