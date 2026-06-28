import type { Metadata } from "next";
import { ModificationPlannerDemo } from "@/components/site/ModificationPlannerDemo";

export const metadata: Metadata = {
  title: "車両改装プランナー | DKT Motors",
  description: "車両改装の要望選択、施工進捗確認、完成後のBefore/After比較を体験できるデモページです。",
};

export default function CustomPlanPage() {
  return <ModificationPlannerDemo />;
}
