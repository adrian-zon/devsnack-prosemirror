import { gateSchema } from "./schema.mjs";

import { Node } from "prosemirror-model";
import { EditorState, Plugin, TextSelection } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import { findWrapping } from "prosemirror-transform";
import { inputRules, wrappingInputRule } from "prosemirror-inputrules";
import { splitListItem } from "prosemirror-schema-list";
import { Element } from "https://www.zeit.de/+/wally/element.js";

function getContent(doc) {
  return {
    title: doc.firstChild.textContent,
    items: [
      {
        accordion: doc.children.slice(1).map((node) => ({
          name: "some",
          items: node.children.slice(1, -1).map((n) =>
            n.type == gateSchema.nodes.list
              ? {
                  list: {
                    icon: "checkmark",
                    color: "green",
                    items: n.children.map((n) => n.textContent),
                  },
                }
              : { text: n.textContent },
          ),
          title: node.firstChild.textContent,
          button: { label: node.lastChild.textContent },
        })),
      },
    ],
  };
}

function toYaml(obj, alreadyIndented = true, indent = 0) {
  if (typeof obj == "string") return obj;
  const indStr = " ".repeat(indent);
  if (Array.isArray(obj)) {
    return (
      "\n" +
      obj.map((v) => indStr + "- " + toYaml(v, true, indent + 2)).join("\n")
    );
  }
  return (
    (alreadyIndented ? "" : `\n${indStr}`) +
    Object.keys(obj)
      .map(
        (k, idx) =>
          `${k}: ${toYaml(obj[k], idx == 0 && !alreadyIndented, indent + 2)}`,
      )
      .join(`\n${indStr}`)
  );
}

function showYaml(elem) {
  return new Plugin({
    view(view) {
      return {
        update({ state }) {
          elem.value = toYaml(getContent(state.doc));
        },
      };
    },
  });
}

function showPreview(elem) {
  return new Plugin({
    view(view) {
      return {
        update({ state }) {
          elem.innerHTML = "";
          new Element({
            target: elem,
            intro: true,
            props: {
              id: "id",
              config: {
                id: "paid",
                type: "gate",
                content: getContent(state.doc),
              },
              settings: {
                ssoUrl: "http://example.com",
              },
              tracking: null,
            },
          });
        },
      };
    },
  });
}

window.view = new EditorView(document.querySelector("#editor"), {
  state: EditorState.create({
    doc: Node.fromJSON(gateSchema, {
      type: "doc",
      content: [
        {
          type: "title",
          content: [{ type: "text", text: "Jetzt Artikel freischalten:" }],
        },
        {
          type: "accordion",
          content: [
            {
              type: "title",
              content: [{ type: "text", text: "Digital-Zugang" }],
            },
            {
              type: "list",
              content: [
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [
                        {
                          type: "text",
                          text: "Alle Artikel auf ZEIT ONLINE frei",
                        },
                      ],
                    },
                  ],
                },
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [
                        {
                          type: "text",
                          text: "Über 3.000 Rezepte im Wochenmarkt",
                        },
                      ],
                    },
                  ],
                },
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [
                        {
                          type: "text",
                          text: "Zusätzlich jeden Mittwoch die Wochenausgabe als E-Paper",
                        },
                      ],
                    },
                  ],
                },
                {
                  type: "listItem",
                  content: [
                    {
                      type: "paragraph",
                      content: [
                        { type: "text", text: "4 Wochen für 1,00 € testen" },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: "button",
              content: [{ type: "text", text: "Jetzt für 1,00 € testen" }],
            },
          ],
        },
      ],
    }),
    plugins: [
      inputRules({
        rules: [wrappingInputRule(/^\s*([-*])\s$/, gateSchema.nodes.list)],
      }),
      keymap({
        Enter(state, dispatch) {
          if (!state.selection.empty) return false;
          const { $from } = state.selection;
          const node = $from.parent;
          if (node.type == gateSchema.nodes.button) {
            if (dispatch) {
              let tr = state.tr.insert(
                $from.after(1),
                gateSchema.nodes.accordion.createAndFill(),
              );
              tr = tr.setSelection(
                TextSelection.create(tr.doc, $from.after(-1) + 2),
              );
              dispatch(tr);
            }
            return true;
          } else if (
            node.type == gateSchema.nodes.paragraph &&
            $from.depth == 2
          ) {
            if (dispatch) {
              let tr = state.tr.insert(
                $from.after(2),
                gateSchema.nodes.paragraph.createAndFill(),
              );
              tr = tr.setSelection(
                TextSelection.create(tr.doc, $from.after(2) + 1),
              );
              dispatch(tr);
            }
            return true;
          }
          return false;
        },
        Backspace(state, dispatch) {
          if (!state.selection.empty) return false;
          const { $from } = state.selection;
          const node = $from.node(-1);
          if (node.type != gateSchema.nodes.accordion) return false;
          if (node.textContent) return false;
          if (dispatch) {
            let tr = state.tr.delete($from.before(1), $from.after(1));
            dispatch(tr);
          }
          return true;
        },
      }),
      keymap({ Enter: splitListItem(gateSchema.nodes.listItem) }),
      keymap(baseKeymap),
      showYaml(document.querySelector("#result")),
      showPreview(document.querySelector("#preview")),
    ],
  }),
});
