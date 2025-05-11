import { gateSchema } from "./schema.mjs";
import { Plugin } from "prosemirror-state";
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

export function showYaml(elem) {
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

export function showPreview(elem) {
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
