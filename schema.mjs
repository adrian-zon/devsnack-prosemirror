import {Schema} from "prosemirror-model"

export const gateSchema = new Schema({
	nodes: {
		text: {inline: true},
		title: {
			content: "text*",
			toDOM() { return ["h1", 0] },
			parseDOM: [{tag: "h1"}]
		},
		listItem: {
			content: "text*",
			toDOM() { return ["li", 0] },
			parseDOM: [{tag: "li"}]
		},
		list: {
			content: "listItem+",
			toDOM() { return ["ul", 0] },
			parseDOM: [{tag: "ul"}]
		},
		button: {
			content: "text*",
			toDOM() { return ["accordion-button", 0] },
			parseDOM: [{tag: "accordion-button"}]
		},
		accordion: {
			content: "title list+ button",
			toDOM() { return ["accordion", 0] },
			parseDOM: [{tag: "accordion"}]
		},
		doc: {content: "title accordion+"}
	}
})
