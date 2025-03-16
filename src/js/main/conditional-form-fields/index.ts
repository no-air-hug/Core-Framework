import { getAll, rIC } from "../../utils";

function conditionalFormFieldController() {
  const elConditionalFormFields = getAll(
    "[is=conditional-input], [is=conditional-select], [is=conditional-textarea]",
  );
  if (elConditionalFormFields.length > 0) import("./conditional-form-fields");
}

const index = () => rIC(conditionalFormFieldController);
export default index;
