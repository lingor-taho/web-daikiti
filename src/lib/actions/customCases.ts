"use server";

export type CustomCaseActionState = {
  ok: boolean;
  message: string;
};

export async function createCustomCaseAction(): Promise<CustomCaseActionState> {
  return {
    ok: false,
    message: "改装事例の作成は次のタスクで実装します。",
  };
}

export async function updateCustomCaseAction(): Promise<CustomCaseActionState> {
  return {
    ok: false,
    message: "改装事例の更新は次のタスクで実装します。",
  };
}
