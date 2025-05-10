import {gateSchema} from "./schema.mjs"

import {EditorState, Plugin} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
import {keymap} from "prosemirror-keymap"
import {baseKeymap} from "prosemirror-commands"
import {findWrapping} from "prosemirror-transform"

function showYaml(elem) {
	return new Plugin({
		view(view) {
			return {
				update({state}) {
					elem.value = state.doc.children.map(n => `- ${n.type.name}: ` + n.textContent).join("\n")
				}
			}
		}
	})
}

window.view = new EditorView(document.querySelector("#editor"), {
	state: EditorState.create({
		schema: gateSchema,
		plugins: [
			keymap({
				Enter(state, dispatch) {
					if (!state.selection.empty) return false
					const { $from } = state.selection
					const node = $from.parent
					if (node.type != gateSchema.nodes.listItem) return false
					if (node.nodeSize > 2) return false
					if ($from.indexAfter(-1) < $from.node(-1).childCount) return false // Not at the end of the accordion list
					if (dispatch) {
						let tr = state.tr.delete($from.before(), $from.after())
						tr = tr.insert(tr.mapping.map($from.after(-2), 1), gateSchema.nodes.accordion.createAndFill())
						dispatch(tr)
					}
					return true
				},
				Backspace(state, dispatch) {
					if (!state.selection.empty) return false
					const { $from } = state.selection
					const node = $from.node(-1)
					if (node.type != gateSchema.nodes.accordion) return false
					if (node.nodeSize > 10) return false
					if (dispatch) {
						let tr = state.tr.delete($from.before(1), $from.after(1))
						dispatch(tr)
					}
					return true
				}
			}),
			keymap(baseKeymap),
			showYaml(document.querySelector('#result')),
		]
	})
})


