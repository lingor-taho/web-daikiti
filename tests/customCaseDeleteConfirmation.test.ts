import assert from "node:assert/strict";
import { test } from "node:test";
import { getCustomCaseDeleteConfirmationMessage, shouldDeleteCustomCase } from "../src/components/admin/CustomCaseRowActions";

test("delete confirmation message names the target custom case", () => {
  assert.equal(
    getCustomCaseDeleteConfirmationMessage("Demo Case"),
    "Demo Caseを完全に削除します。この操作は取り消せません。",
  );
});

test("shouldDeleteCustomCase returns the user's confirmation choice", () => {
  assert.equal(shouldDeleteCustomCase("Demo Case", () => true), true);
  assert.equal(shouldDeleteCustomCase("Demo Case", () => false), false);
});
