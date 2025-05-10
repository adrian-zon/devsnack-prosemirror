import { Schema } from "prosemirror-model";

export const gateSchema = new Schema({
  nodes: {
    text: { inline: true },
    paragraph: {
      content: "text*",
      toDOM() {
        return ["p", 0];
      },
      parseDOM: [{ tag: "p" }],
    },
    title: {
      content: "text*",
      toDOM() {
        return ["h1", 0];
      },
      parseDOM: [{ tag: "h1" }],
    },
    listItem: {
      content: "paragraph",
      toDOM() {
        return ["li", 0];
      },
      parseDOM: [{ tag: "li" }],
    },
    list: {
      content: "listItem+",
      toDOM() {
        return ["ul", 0];
      },
      parseDOM: [{ tag: "ul" }],
    },
    button: {
      content: "text*",
      toDOM() {
        return ["accordion-button", 0];
      },
      parseDOM: [{ tag: "accordion-button" }],
    },
    accordion: {
      content: "title (paragraph|list)+ button",
      toDOM() {
        return ["accordion", 0];
      },
      parseDOM: [{ tag: "accordion" }],
    },
    doc: { content: "title accordion+" },
  },
});
