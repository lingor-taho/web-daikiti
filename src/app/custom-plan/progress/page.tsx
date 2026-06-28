import type { Metadata } from "next";
import { ModificationProgressPage } from "@/components/site/ModificationPlannerDemo";

export const metadata: Metadata = {
  title: "改装進度リスト | DKT Motors",
  description: "改装案件ごとの全体進捗、分項目の完了率、作業メモを確認できるデモページです。",
};

export default function CustomPlanProgressPage() {
  return <ModificationProgressPage />;
}
