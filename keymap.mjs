import { gateSchema } from "./schema.mjs";
import { chainCommands } from "prosemirror-commands";
import { splitListItem } from "prosemirror-schema-list";
import { TextSelection } from "prosemirror-state";
import { findWrapping } from "prosemirror-transform";

export default {
  Enter: chainCommands(
    function (state, dispatch) {
      if (!state.selection.empty) return false;
      const { $from } = state.selection;
      const node = $from.parent;
      if (node.type == gateSchema.nodes.button) {
        if (dispatch) {
          let tr = state.tr.insert(
            $from.after(1),
            gateSchema.nodes.accordion.createAndFill(),
          );
          tr = tr.setSelection(TextSelection.create(tr.doc, $from.after(-1) + 2));
          dispatch(tr);
        }
        return true;
      } else if (node.type == gateSchema.nodes.paragraph && $from.depth == 2) {
        if (dispatch) {
          let tr = state.tr.insert(
            $from.after(2),
            gateSchema.nodes.paragraph.createAndFill(),
          );
          tr = tr.setSelection(TextSelection.create(tr.doc, $from.after(2) + 1));
          dispatch(tr);
        }
        return true;
      }
      return false;
    },
    splitListItem(gateSchema.nodes.listItem)
  ),
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
};
