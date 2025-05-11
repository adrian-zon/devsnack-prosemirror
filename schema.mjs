import { Node, Schema } from "prosemirror-model";

export const gateSchema = new Schema({
  nodes: {
    text: { inline: true },
    paragraph: {
      content: "text*",
      toDOM: () => ["p", 0],
      parseDOM: [{ tag: "p" }],
    },
    title: {
      content: "text*",
      toDOM: () => ["h1", 0],
      parseDOM: [{ tag: "h1" }],
    },
    listItem: {
      content: "paragraph",
      toDOM: () => ["li", 0],
      parseDOM: [{ tag: "li" }],
    },
    list: {
      content: "listItem+",
      toDOM: () => ["ul", 0],
      parseDOM: [{ tag: "ul" }],
    },
    button: {
      content: "text*",
      toDOM: () => ["accordion-button", 0],
      parseDOM: [{ tag: "accordion-button" }],
    },
    accordion: {
      content: "title (paragraph|list)+ button",
      toDOM: () => ["accordion", 0],
      parseDOM: [{ tag: "accordion" }],
    },
    doc: { content: "title accordion+" },
  },
});

export const exampleDoc = Node.fromJSON(gateSchema, {
  type: "doc",
  content: [
    { type: "title", content: [{ type: "text", text: "Jetzt Artikel freischalten:" }], },
    {
      type: "accordion",
      content: [
        { type: "title", content: [{ type: "text", text: "Digital-Zugang" }], },
        {
          type: "list",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [ { type: "text", text: "Alle Artikel auf ZEIT ONLINE frei", }, ],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [ { type: "text", text: "Über 3.000 Rezepte im Wochenmarkt", }, ],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [ { type: "text", text: "Zusätzlich jeden Mittwoch die Wochenausgabe als E-Paper", }, ],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [ { type: "text", text: "4 Wochen für 1,00 € testen" }, ],
                },
              ],
            },
          ],
        },
        { type: "button", content: [{ type: "text", text: "Jetzt für 1,00 € testen" }], },
      ],
    },
  ],
});
