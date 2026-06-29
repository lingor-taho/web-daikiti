"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import {
  Armchair,
  BedDouble,
  Box,
  Car,
  Check,
  ChevronLeft,
  ClipboardCheck,
  Clock3,
  Gauge,
  Mountain,
  Paintbrush,
  PackageCheck,
  Send,
  ShieldCheck,
  Wrench,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";

type CustomCategory = {
  id: string;
  title: string;
  description: string;
  icon: typeof Paintbrush;
  items: CustomItem[];
};

type CustomItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  work: string[];
  variants: CustomVariant[];
};

type CustomVariant = {
  id: string;
  name: string;
  description: string;
  image: string;
  priceAdjust?: number;
};

type SelectedCustom = {
  key: string;
  item: CustomItem;
  variant: CustomVariant;
  price: number;
};

type ProgressItem = {
  id: string;
  title: string;
  owner: string;
  status: string;
  statusTone: "complete" | "active" | "waiting";
  percent: number;
  current: string;
  beforeImage: string;
  afterImage?: string;
  modules: { name: string; percent: number; note: string; status: string }[];
  photos: { name: string; status: string; percent: number; beforeImage?: string; afterImage?: string; note: string }[];
  updates: { time: string; title: string; body: string; done: boolean }[];
};

const usageOptions = ["日常利用", "仕事用", "車中泊", "アウトドア", "ファミリー", "展示・イベント"];
const vehicleOptions = ["ハイエース", "ジムニー", "キャラバン", "軽バン", "SUV", "その他"];

const customCategories: CustomCategory[] = [
  {
    id: "exterior",
    title: "外装カスタム",
    description: "見た目の印象と保護性能をまとめて整えます。",
    icon: Paintbrush,
    items: [
      {
        id: "aero-kit",
        name: "エアロ・外装パーツ",
        description: "フロント/サイド/リアの外装パーツ取付。",
        price: 180000,
        duration: "3〜5日",
        work: ["適合確認", "塗装色合わせ", "外装パーツ取付", "固定部チェック"],
        variants: [
          { id: "aero-front", name: "フロントスポイラー", description: "顔まわりを低く見せる定番スタイル。", image: "/images/custom-plan-products/roof-rack.png" },
          { id: "aero-side", name: "サイドステップ", description: "横姿のラインを整える外装パーツ。", image: "/images/custom-plan-products/roof-rack.png", priceAdjust: 28000 },
          { id: "aero-full", name: "フルエアロセット", description: "前後左右をまとめて統一するセット。", image: "/images/custom-plan-products/roof-rack.png", priceAdjust: 120000 },
        ],
      },
      {
        id: "roof-rack",
        name: "ルーフラック",
        description: "キャンプ用品や仕事道具を積むルーフまわり。",
        price: 120000,
        duration: "1〜2日",
        work: ["取付位置確認", "ラック組立", "防水処理", "走行時異音確認"],
        variants: [
          { id: "rack-flat", name: "フラットラック", description: "車高を抑えた薄型ラック。", image: "/images/custom-plan-products/roof-rack.png" },
          { id: "rack-basket", name: "バスケットラック", description: "キャンプ用品を固定しやすい囲い付き。", image: "/images/custom-plan-products/roof-rack.png", priceAdjust: 36000 },
          { id: "rack-work", name: "業務用ロングラック", description: "長尺物と脚立を積みやすい仕様。", image: "/images/custom-plan-products/roof-rack.png", priceAdjust: 68000 },
        ],
      },
      {
        id: "protective-film",
        name: "保護フィルム",
        description: "飛び石や擦れやすい箇所を透明フィルムで保護。",
        price: 85000,
        duration: "1日",
        work: ["施工範囲確認", "下地洗浄", "フィルム施工", "端部仕上げ"],
        variants: [
          { id: "film-clear", name: "透明プロテクション", description: "見た目を変えずに飛び石を保護。", image: "/images/custom-plan-products/roof-rack.png" },
          { id: "film-matte", name: "マット調フィルム", description: "反射を抑えた落ち着いた質感。", image: "/images/custom-plan-products/roof-rack.png", priceAdjust: 22000 },
          { id: "film-carbon", name: "カーボン調フィルム", description: "ドアステップやボンネット向けの柄入り。", image: "/images/custom-plan-products/roof-rack.png", priceAdjust: 38000 },
        ],
      },
    ],
  },
  {
    id: "interior",
    title: "内装アップグレード",
    description: "乗車中の快適性、収納性、使いやすさを高めます。",
    icon: Armchair,
    items: [
      {
        id: "seat-cover",
        name: "シートカバー",
        description: "耐久性の高いカバーで車内の雰囲気を統一。",
        price: 78000,
        duration: "半日",
        work: ["シート形状確認", "カバー取付", "固定部調整", "清掃仕上げ"],
        variants: [
          { id: "seat-black", name: "ブラックレザー調", description: "汚れに強い標準仕様。", image: "/images/custom-plan-products/camper-interior.jpg" },
          { id: "seat-brown", name: "ブラウンレザー調", description: "落ち着いた車内に合わせやすい色。", image: "/images/custom-plan-products/camper-bed.jpg", priceAdjust: 12000 },
        ],
      },
      {
        id: "floor-insulation",
        name: "床張り・断熱",
        description: "床面をフラットに整え、断熱材で快適性を向上。",
        price: 210000,
        duration: "3〜4日",
        work: ["内装分解", "断熱材施工", "床板加工", "床材仕上げ"],
        variants: [
          { id: "floor-wood", name: "木目フロア", description: "車中泊と日常利用に合う温かい質感。", image: "/images/custom-plan-products/camper-interior.jpg" },
          { id: "floor-rubber", name: "防水ラバーフロア", description: "仕事道具やアウトドア用品に強い床材。", image: "/images/custom-plan-real/van-before.jpg", priceAdjust: 18000 },
        ],
      },
      {
        id: "interior-light",
        name: "ルームLED照明",
        description: "荷室や車中泊時に使いやすい照明を追加。",
        price: 68000,
        duration: "1日",
        work: ["配線ルート確認", "照明取付", "スイッチ追加", "点灯確認"],
        variants: [
          { id: "light-line", name: "ラインLED", description: "荷室全体を均一に照らす照明。", image: "/images/custom-plan-products/camper-bed.jpg" },
          { id: "light-spot", name: "スポットLED", description: "作業場所を狙って照らす仕様。", image: "/images/custom-plan-products/camper-interior.jpg", priceAdjust: 10000 },
        ],
      },
    ],
  },
  {
    id: "camper",
    title: "車中泊仕様",
    description: "寝る、積む、電気を使うための基本装備を構成します。",
    icon: BedDouble,
    items: [
      {
        id: "bed-kit",
        name: "ベッドキット",
        description: "車種に合わせたフラットベッドを取付。",
        price: 240000,
        duration: "2〜3日",
        work: ["採寸", "フレーム組立", "マット調整", "収納動線確認"],
        variants: [
          { id: "bed-fold", name: "折りたたみベッド", description: "普段は荷室を広く使える仕様。", image: "/images/custom-plan-products/camper-bed.jpg" },
          { id: "bed-fixed", name: "固定式ベッド", description: "寝心地と収納量を重視。", image: "/images/custom-plan-products/camper-interior.jpg", priceAdjust: 30000 },
        ],
      },
      {
        id: "sub-battery",
        name: "サブバッテリー",
        description: "照明、冷蔵庫、充電機器用の電源を増設。",
        price: 320000,
        duration: "3〜5日",
        work: ["電源容量確認", "配線施工", "充電器取付", "負荷テスト"],
        variants: [
          { id: "battery-standard", name: "標準容量セット", description: "照明とスマホ充電中心の構成。", image: "/images/custom-plan-products/aux-battery.png" },
          { id: "battery-large", name: "大容量セット", description: "冷蔵庫や長時間利用に対応。", image: "/images/custom-plan-products/aux-battery.png", priceAdjust: 90000 },
        ],
      },
      {
        id: "privacy-shade",
        name: "遮光・断熱シェード",
        description: "就寝時の視線と暑さ寒さを軽減。",
        price: 55000,
        duration: "半日",
        work: ["窓サイズ確認", "シェード合わせ", "収納確認", "装着説明"],
        variants: [
          { id: "shade-full", name: "全面シェード", description: "就寝時の遮光を重視。", image: "/images/custom-plan-products/camper-bed.jpg" },
          { id: "shade-rear", name: "リア重点シェード", description: "荷室側を中心にカバー。", image: "/images/custom-plan-products/camper-interior.jpg", priceAdjust: -12000 },
        ],
      },
    ],
  },
  {
    id: "storage",
    title: "業務用収納",
    description: "工具、部材、在庫を取り出しやすい荷室へ変更します。",
    icon: Box,
    items: [
      {
        id: "cargo-rack",
        name: "収納ラック",
        description: "荷室寸法に合わせた棚・ラックを設置。",
        price: 190000,
        duration: "2〜4日",
        work: ["積載物確認", "棚割り設計", "ラック固定", "耐荷重確認"],
        variants: [
          { id: "cargo-left", name: "片側ラック", description: "通路を広く残す仕事向け。", image: "/images/custom-plan-products/cargo-storage.png" },
          { id: "cargo-both", name: "両側ラック", description: "収納量を最大化。", image: "/images/custom-plan-products/cargo-storage.png", priceAdjust: 70000 },
        ],
      },
      {
        id: "drawer-unit",
        name: "引き出しユニット",
        description: "小物や工具を分類しやすい引き出しを追加。",
        price: 160000,
        duration: "2〜3日",
        work: ["寸法確認", "ユニット組立", "レール調整", "固定確認"],
        variants: [
          { id: "drawer-low", name: "低床引き出し", description: "床下に道具を整理。", image: "/images/custom-plan-products/cargo-storage.png" },
          { id: "drawer-tall", name: "工具箱一体型", description: "工具の分類を重視。", image: "/images/custom-plan-products/cargo-storage.png", priceAdjust: 42000 },
        ],
      },
      {
        id: "partition-board",
        name: "荷室パーティション",
        description: "乗員スペースと荷物スペースを分けます。",
        price: 90000,
        duration: "1〜2日",
        work: ["取付位置確認", "ボード加工", "固定施工", "視界確認"],
        variants: [
          { id: "partition-mesh", name: "メッシュタイプ", description: "視界を残す軽量仕様。", image: "/images/custom-plan-products/cargo-storage.png" },
          { id: "partition-solid", name: "パネルタイプ", description: "荷崩れ防止を重視。", image: "/images/custom-plan-products/cargo-storage.png", priceAdjust: 18000 },
        ],
      },
    ],
  },
  {
    id: "electric",
    title: "電装・快適装備",
    description: "安全確認、充電、車内操作を便利にします。",
    icon: Zap,
    items: [
      {
        id: "back-camera",
        name: "バックカメラ",
        description: "後退時の視認性を高めるカメラを取付。",
        price: 72000,
        duration: "1日",
        work: ["取付位置確認", "配線施工", "映像入力設定", "表示確認"],
        variants: [
          { id: "camera-standard", name: "標準バックカメラ", description: "後退時の確認用。", image: "/images/custom-plan-products/dashcam.png" },
          { id: "camera-wide", name: "広角カメラ", description: "荷物や死角の確認範囲を拡大。", image: "/images/custom-plan-products/dashcam.png", priceAdjust: 16000 },
        ],
      },
      {
        id: "drive-recorder",
        name: "前後ドラレコ",
        description: "前後録画と駐車監視に対応したレコーダー。",
        price: 88000,
        duration: "1日",
        work: ["配線ルート確認", "本体取付", "カメラ角度調整", "録画確認"],
        variants: [
          { id: "recorder-front-rear", name: "前後録画", description: "基本の前後カメラ。", image: "/images/custom-plan-products/dashcam.png" },
          { id: "recorder-parking", name: "駐車監視付き", description: "駐車中の監視にも対応。", image: "/images/custom-plan-products/dashcam.png", priceAdjust: 24000 },
        ],
      },
      {
        id: "usb-panel",
        name: "USB/AC電源パネル",
        description: "仕事や旅行で使いやすい充電口を増設。",
        price: 64000,
        duration: "半日",
        work: ["設置位置確認", "電源分岐", "パネル加工", "出力確認"],
        variants: [
          { id: "usb-rear", name: "リアUSBパネル", description: "後席や荷室で充電しやすい位置。", image: "/images/custom-plan-products/power-panel.png" },
          { id: "usb-ac", name: "AC付き電源パネル", description: "仕事道具の充電にも対応。", image: "/images/custom-plan-products/power-panel.png", priceAdjust: 30000 },
        ],
      },
    ],
  },
  {
    id: "offroad",
    title: "オフロード",
    description: "走破性、足回り、アウトドア感を強化します。",
    icon: Mountain,
    items: [
      {
        id: "wheel-tire",
        name: "ホイール・タイヤ",
        description: "用途に合わせたタイヤとホイールへ交換。",
        price: 260000,
        duration: "1日",
        work: ["サイズ確認", "組替・バランス", "装着確認", "試走チェック"],
        variants: [
          { id: "tire-at", name: "A/Tタイヤセット", description: "街乗りと悪路のバランス型。", image: "/images/custom-plan-products/roof-rack.png" },
          { id: "tire-mt", name: "M/Tタイヤセット", description: "悪路の存在感を強める仕様。", image: "/images/custom-plan-products/roof-rack.png", priceAdjust: 36000 },
        ],
      },
      {
        id: "lift-up",
        name: "リフトアップ",
        description: "足回りを調整し、見た目と走破性を向上。",
        price: 310000,
        duration: "2〜3日",
        work: ["足回り点検", "サスペンション交換", "アライメント", "試走確認"],
        variants: [
          { id: "lift-1inch", name: "1インチアップ", description: "普段使いを残した控えめな上げ幅。", image: "/images/custom-plan-real/suspension-before.jpg" },
          { id: "lift-2inch", name: "2インチアップ", description: "見た目と走破性をしっかり強化。", image: "/images/custom-plan-real/suspension-after.jpg", priceAdjust: 52000 },
        ],
      },
      {
        id: "under-guard",
        name: "アンダーガード",
        description: "下回りの保護パーツを追加。",
        price: 145000,
        duration: "1〜2日",
        work: ["干渉確認", "ガード取付", "締付確認", "下回り点検"],
        variants: [
          { id: "guard-front", name: "フロントガード", description: "前方下回りを保護。", image: "/images/custom-plan-real/suspension-before.jpg" },
          { id: "guard-full", name: "下回りフルガード", description: "アウトドア走行向けの広範囲保護。", image: "/images/custom-plan-real/suspension-after.jpg", priceAdjust: 78000 },
        ],
      },
    ],
  },
];

const steps = [
  { label: "用途・車種", icon: Car },
  { label: "改装内容", icon: Wrench },
  { label: "確認・送信", icon: ClipboardCheck },
];

const progressItems: ProgressItem[] = [
  {
    id: "DKT-2406-018",
    title: "ハイエース 車中泊パッケージ",
    owner: "大阪府 / T様",
    status: "完成",
    statusTone: "complete",
    percent: 100,
    current: "納車準備完了",
    beforeImage: "/images/custom-works/hiace-camper-before.png",
    afterImage: "/images/custom-works/hiace-camper-after.png",
    modules: [
      { name: "ベッドキット", percent: 100, note: "固定・マット調整完了", status: "完了" },
      { name: "床張り・断熱", percent: 100, note: "断熱材と床材の仕上げ完了", status: "完了" },
      { name: "サブバッテリー", percent: 100, note: "負荷テストと充電確認完了", status: "完了" },
      { name: "遮光シェード", percent: 100, note: "装着説明まで完了", status: "完了" },
    ],
    photos: [
      { name: "ベッドキット", status: "完了", percent: 100, beforeImage: "/images/custom-plan-products/camper-interior.jpg", afterImage: "/images/custom-plan-products/camper-bed.jpg", note: "ベッド展開と収納動線を撮影済み。" },
      { name: "床張り・断熱", status: "完了", percent: 100, beforeImage: "/images/custom-plan-real/van-before.jpg", afterImage: "/images/custom-plan-products/camper-interior.jpg", note: "床材仕上げと段差の収まりを撮影済み。" },
      { name: "サブバッテリー", status: "完了", percent: 100, beforeImage: "/images/custom-plan-real/car-battery.jpg", afterImage: "/images/custom-plan-real/rv-battery.jpg", note: "電源パネルと充電確認を撮影済み。" },
      { name: "遮光シェード", status: "完了", percent: 100, beforeImage: "/images/custom-plan-products/camper-interior.jpg", afterImage: "/images/custom-plan-products/camper-bed.jpg", note: "装着状態を撮影済み。" },
    ],
    updates: [
      { time: "06/02 10:20", title: "ヒアリング完了", body: "車中泊中心の利用として電源容量と収納位置を確定。", done: true },
      { time: "06/07 18:40", title: "内装施工完了", body: "床張り、断熱、ベッドフレームの取付が完了。", done: true },
      { time: "06/10 15:15", title: "電装確認完了", body: "サブバッテリーとLED照明の負荷テスト完了。", done: true },
      { time: "06/12 11:30", title: "完成写真共有", body: "Before / After 写真を登録し納車準備へ移行。", done: true },
    ],
  },
  {
    id: "DKT-2406-026",
    title: "ジムニー オフロード外装",
    owner: "京都府 / S様",
    status: "施工中",
    statusTone: "active",
    percent: 42,
    current: "リフトアップとタイヤ調整中",
    beforeImage: "/images/custom-works/jimny-offroad-after.png",
    modules: [
      { name: "ホイール・タイヤ", percent: 80, note: "組替完了、試走前確認中", status: "施工中" },
      { name: "リフトアップ", percent: 45, note: "サスペンション交換中", status: "施工中" },
      { name: "アンダーガード", percent: 0, note: "部品入庫待ち", status: "待機" },
      { name: "外装パーツ", percent: 20, note: "取付位置を確認済み", status: "準備中" },
    ],
    photos: [
      { name: "ホイール・タイヤ", status: "施工中", percent: 80, beforeImage: "/images/custom-works/jimny-offroad-after.png", note: "完了撮影は試走確認後に更新。" },
      { name: "リフトアップ", status: "施工中", percent: 45, beforeImage: "/images/custom-plan-real/suspension-before.jpg", note: "足回り調整中。完了後に該当箇所を撮影。" },
      { name: "アンダーガード", status: "待機", percent: 0, beforeImage: "/images/custom-plan-real/suspension-after.jpg", note: "部品入庫後に施工写真を追加。" },
      { name: "外装パーツ", status: "準備中", percent: 20, beforeImage: "/images/custom-works/jimny-offroad-after.png", note: "取付完了後に外装部分を撮影。" },
    ],
    updates: [
      { time: "06/21 09:10", title: "入庫確認", body: "車両状態と足回りの取付条件を確認。", done: true },
      { time: "06/22 17:00", title: "タイヤ組替", body: "ホイール・タイヤを組替、干渉箇所を点検中。", done: true },
      { time: "06/24 14:30", title: "足回り施工中", body: "リフトアップ作業を進行中。試走後に微調整予定。", done: false },
      { time: "予定", title: "最終チェック", body: "外装パーツ取付後に試走と締付確認を実施。", done: false },
    ],
  },
  {
    id: "DKT-2406-031",
    title: "キャラバン 業務用収納",
    owner: "兵庫県 / 法人A",
    status: "部品手配",
    statusTone: "waiting",
    percent: 18,
    current: "収納ラック部材の到着待ち",
    beforeImage: "/images/custom-works/caravan-storage-after.png",
    modules: [
      { name: "収納ラック", percent: 20, note: "棚割り設計済み、部材手配中", status: "手配中" },
      { name: "引き出しユニット", percent: 10, note: "寸法確認済み", status: "手配中" },
      { name: "荷室パーティション", percent: 0, note: "ラック施工後に位置決め", status: "待機" },
      { name: "床保護材", percent: 40, note: "素材選定完了", status: "準備中" },
    ],
    photos: [
      { name: "収納ラック", status: "手配中", percent: 20, beforeImage: "/images/custom-works/caravan-storage-after.png", note: "部材入庫後、ラック取付写真を更新。" },
      { name: "引き出しユニット", status: "手配中", percent: 10, beforeImage: "/images/custom-works/caravan-storage-after.png", note: "施工完了後に引き出し部分を撮影。" },
      { name: "荷室パーティション", status: "待機", percent: 0, beforeImage: "/images/custom-plan-real/van-before.jpg", note: "位置決め後にBefore/Afterを追加。" },
      { name: "床保護材", status: "準備中", percent: 40, beforeImage: "/images/custom-works/hiace-camper-before.png", note: "床保護材の貼付完了後に写真更新。" },
    ],
    updates: [
      { time: "06/24 16:00", title: "要件確定", body: "工具箱、長尺物、消耗品の収納位置を確定。", done: true },
      { time: "06/25 12:40", title: "棚割り設計", body: "荷室寸法に合わせたラック構成を作成。", done: true },
      { time: "06/26 09:20", title: "部品手配", body: "ラック部材と引き出しユニットを手配中。", done: false },
      { time: "予定", title: "荷室施工", body: "部材入庫後にラック固定と耐荷重確認へ進行。", done: false },
    ],
  },
];

const currencyFormatter = new Intl.NumberFormat("ja-JP");
const IMAGE_VERSION = "20260628c";

const allCustomItems = customCategories.flatMap((category) => category.items);

function imageSrc(src: string) {
  return src.includes("?") ? `${src}&v=${IMAGE_VERSION}` : `${src}?v=${IMAGE_VERSION}`;
}

function getVariantPrice(item: CustomItem, variant: CustomVariant) {
  return item.price + (variant.priceAdjust ?? 0);
}

function getSelectedCustoms(selectedVariantIds: string[]) {
  return allCustomItems.flatMap((item) =>
    item.variants
      .filter((variant) => selectedVariantIds.includes(variant.id))
      .map((variant) => ({
        key: variant.id,
        item,
        variant,
        price: getVariantPrice(item, variant),
      })),
  );
}

export function ModificationPlannerDemo() {
  const [activeStep, setActiveStep] = useState(0);
  const [usage, setUsage] = useState(usageOptions[2]);
  const [vehicle, setVehicle] = useState(vehicleOptions[0]);
  const [activeCategoryId, setActiveCategoryId] = useState(customCategories[2].id);
  const [activeItemId, setActiveItemId] = useState(customCategories[2].items[0].id);
  const [selectedVariantIds, setSelectedVariantIds] = useState(["bed-fold", "floor-wood", "battery-standard"]);
  const [submitted, setSubmitted] = useState(false);

  const activeCategory = customCategories.find((category) => category.id === activeCategoryId) ?? customCategories[0];
  const activeItem = activeCategory.items.find((item) => item.id === activeItemId) ?? activeCategory.items[0];
  const selectedItems = useMemo(() => getSelectedCustoms(selectedVariantIds), [selectedVariantIds]);
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);

  const chooseCategory = (id: string) => {
    setSubmitted(false);
    const nextCategory = customCategories.find((category) => category.id === id) ?? customCategories[0];
    setActiveCategoryId(id);
    setActiveItemId(nextCategory.items[0].id);
  };

  const toggleVariant = (id: string) => {
    setSubmitted(false);
    setSelectedVariantIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  return (
    <main className="custom-plan-page">
      <CustomPlanHero />

      <section className="section custom-plan-workspace" aria-label="改装デモ操作画面">
        <div className="container">
          <section className="custom-plan-builder" aria-labelledby="custom-plan-builder-heading">
            <div className="custom-plan-builder__top">
              <div className="custom-plan-panel-heading">
                <span>REQUEST BUILDER</span>
                <h2 id="custom-plan-builder-heading">改装要望を選択</h2>
                <p>最初に用途と車種を選び、次に具体的な改装内容を追加します。予算は選択した内容から自動で合計します。</p>
              </div>
              <Link className="custom-plan-progress-link" href="/custom-plan/progress">
                <Gauge aria-hidden="true" size={18} />
                改装進度を見る
              </Link>
            </div>

            <StepProgress activeStep={activeStep} onStepChange={setActiveStep} />

            {activeStep === 0 ? (
              <div className="custom-plan-form-grid custom-plan-stage">
                <SelectionGroup label="用途" options={usageOptions} value={usage} onChange={setUsage} />
                <SelectionGroup label="車種" options={vehicleOptions} value={vehicle} onChange={setVehicle} />
                <div className="custom-plan-stage__actions">
                  <button className="custom-plan-submit__button" type="button" onClick={() => setActiveStep(1)}>
                    次へ進む
                    <Wrench aria-hidden="true" size={18} />
                  </button>
                </div>
              </div>
            ) : null}

            {activeStep === 1 ? (
              <div className="custom-plan-stage">
                <div className="custom-plan-section-title">
                  <h3>具体的な改装内容を選択</h3>
                  <p>左の主類を切り替え、中央で詳細項目を選択します。選んだ項目は右側にまとまります。</p>
                </div>

                <div className="custom-plan-selector">
                  <div className="custom-plan-category-rail" aria-label="改装大類">
                    {customCategories.map((category) => {
                      const Icon = category.icon;
                      const selectedCount = category.items.reduce(
                        (count, item) => count + item.variants.filter((variant) => selectedVariantIds.includes(variant.id)).length,
                        0,
                      );
                      return (
                        <div className="custom-plan-category-group" key={category.id}>
                          <button
                            className={category.id === activeCategoryId ? "is-active" : ""}
                            type="button"
                            onClick={() => chooseCategory(category.id)}
                          >
                            <Icon aria-hidden="true" size={19} />
                            <span>{category.title}</span>
                            {selectedCount > 0 ? <strong>{selectedCount}</strong> : null}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="custom-plan-detail-panel">
                    <div className="custom-plan-detail-panel__head">
                      <strong>{activeCategory.title}</strong>
                      <p>{activeCategory.description}</p>
                    </div>
                    <div className="custom-plan-detail-list" aria-label={`${activeCategory.title}の詳細メニュー`}>
                      {activeCategory.items.map((item) => {
                        const isActive = item.id === activeItem.id;
                        const selectedCount = item.variants.filter((variant) => selectedVariantIds.includes(variant.id)).length;
                        return (
                          <article className={`custom-plan-detail-item${isActive ? " is-expanded" : ""}`} key={item.id}>
                            <button type="button" onClick={() => setActiveItemId(item.id)}>
                              <span>{selectedCount > 0 ? <Check aria-hidden="true" size={16} /> : <PackageCheck aria-hidden="true" size={16} />}</span>
                              <strong>{item.name}</strong>
                              <small>{item.description}</small>
                              <em>基本 {currencyFormatter.format(item.price)}円 / {item.duration}</em>
                            </button>
                            {isActive ? (
                              <div className="custom-plan-variant-panel">
                                <div className="custom-plan-variant-panel__head">
                                  <strong>{item.name} のスタイルを選択</strong>
                                  <small>画像を見ながら具体的な仕様を選べます。</small>
                                </div>
                                <div className="custom-plan-variant-grid">
                                  {item.variants.map((variant) => {
                                    const isSelected = selectedVariantIds.includes(variant.id);
                                    const price = getVariantPrice(item, variant);
                                    return (
                                      <button
                                        className={isSelected ? "is-selected" : ""}
                                        key={variant.id}
                                        type="button"
                                        onClick={() => toggleVariant(variant.id)}
                                      >
                                        <img src={imageSrc(variant.image)} alt={variant.name} loading="eager" />
                                        {isSelected ? (
                                          <span className="custom-plan-variant-check">
                                            <Check aria-hidden="true" size={17} />
                                          </span>
                                        ) : null}
                                        <strong>{variant.name}</strong>
                                        <small>{variant.description}</small>
                                        <em>{currencyFormatter.format(price)}円</em>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            ) : null}
                          </article>
                        );
                      })}
                    </div>
                  </div>

                  <SelectedSummary selectedItems={selectedItems} totalPrice={totalPrice} onRemove={toggleVariant} compact={false} />
                </div>

                <div className="custom-plan-stage__actions custom-plan-stage__actions--split">
                  <button className="custom-plan-back-button" type="button" onClick={() => setActiveStep(0)}>
                    <ChevronLeft aria-hidden="true" size={17} />
                    戻る
                  </button>
                  <button
                    className="custom-plan-submit__button"
                    type="button"
                    onClick={() => setActiveStep(2)}
                    disabled={selectedItems.length === 0}
                  >
                    内容を確認
                    <ClipboardCheck aria-hidden="true" size={18} />
                  </button>
                </div>
              </div>
            ) : null}

            {activeStep === 2 ? (
              <div className="custom-plan-stage">
                <div className="custom-plan-confirm">
                  <div>
                    <div className="custom-plan-section-title">
                      <h3>改装内容と金額の確認</h3>
                      <p>選択した内容に基づく概算です。実際の金額は車両状態と部品在庫を確認して確定します。</p>
                    </div>
                    <div className="custom-plan-confirm__meta">
                      <span>用途: <strong>{usage}</strong></span>
                      <span>車種: <strong>{vehicle}</strong></span>
                      <span>選択項目: <strong>{selectedItems.length}件</strong></span>
                    </div>
                    <div className="custom-plan-work-list">
                      {selectedItems.flatMap((selected) => selected.item.work.map((work) => `${selected.item.name}: ${work}`)).slice(0, 10).map((work) => (
                        <span key={work}>{work}</span>
                      ))}
                    </div>
                  </div>
                  <SelectedSummary selectedItems={selectedItems} totalPrice={totalPrice} onRemove={toggleVariant} compact />
                </div>

                <div className="custom-plan-submit">
                  <div>
                    <span>概算合計</span>
                    <strong>{currencyFormatter.format(totalPrice)}円</strong>
                  </div>
                  <button className="custom-plan-submit__button" type="button" onClick={() => setSubmitted(true)}>
                    <Send aria-hidden="true" size={18} />
                    改装需求を提出
                  </button>
                </div>

                <div className={`custom-plan-result${submitted ? " is-visible" : ""}`} aria-live="polite">
                  <ShieldCheck aria-hidden="true" size={22} />
                  <div>
                    <strong>提出ボタンのデモ表示です</strong>
                    <p>{usage}向けの{vehicle}改装として、{selectedItems.length}件の施工候補と概算金額を確認しました。</p>
                  </div>
                </div>

                <div className="custom-plan-stage__actions">
                  <button className="custom-plan-back-button" type="button" onClick={() => setActiveStep(1)}>
                    <ChevronLeft aria-hidden="true" size={17} />
                    改装内容を修正
                  </button>
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </section>

      <section className="section custom-plan-flow" aria-labelledby="custom-plan-flow-heading">
        <div className="container">
          <div className="custom-plan-panel-heading">
            <span>STANDARD FLOW</span>
            <h2 id="custom-plan-flow-heading">標準化できる改装フロー</h2>
            <p>要望選択、見積確認、施工進捗、完成写真共有まで、ユーザーが状態を追いやすい流れに整理しています。</p>
          </div>
          <div className="custom-plan-flow-grid">
            {["用途・車種確認", "詳細メニュー選択", "概算金額確認", "施工進捗共有", "完成写真・納車"].map((item, index) => (
              <article key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item}</h3>
                <p>
                  {index === 0
                    ? "最初に利用シーンと車種だけを絞り込みます。"
                    : index === 1
                      ? "6つの主類から具体的な施工内容を選択します。"
                      : index === 2
                        ? "選択項目ごとの金額と合計を確認して提出します。"
                        : index === 3
                          ? "進度ページで工程別の完了率と作業メモを共有します。"
                          : "Before / After と納車準備状況を確認できます。"}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export function ModificationProgressPage() {
  return (
    <main className="custom-plan-page custom-plan-page--progress">
      <section className="custom-plan-hero custom-plan-hero--progress">
        <div className="container custom-plan-hero__grid">
          <div className="custom-plan-hero__copy">
            <p className="custom-plan-hero__label">PROGRESS BOARD</p>
            <h1>改装進度リスト</h1>
            <p>各案件の全体進捗、分項目の完了率、作業メモ、Before / After の確認状態をまとめた進度確認ページです。</p>
            <div className="custom-plan-hero__actions">
              <Link className="custom-plan-progress-link custom-plan-progress-link--light" href="/custom-plan">
                <ChevronLeft aria-hidden="true" size={18} />
                改装要望へ戻る
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section custom-plan-progress-page" aria-label="改装進度詳細">
        <div className="container custom-plan-progress-page__list">
          {progressItems.map((item) => {
            const isComplete = item.percent === 100 && item.afterImage;
            return (
              <article className="custom-plan-progress-detail" key={item.id}>
                <div className="custom-plan-progress-detail__head">
                  <div>
                    <span className="custom-plan-progress-card__id">{item.id}</span>
                    <h2>{item.title}</h2>
                    <p>{item.owner}</p>
                  </div>
                  <span className={`custom-plan-status custom-plan-status--${item.statusTone}`}>{item.status}</span>
                </div>

                <div className="custom-plan-progress-meter custom-plan-progress-meter--large">
                  <div>
                    <Gauge aria-hidden="true" size={18} />
                    <span>{item.current}</span>
                  </div>
                  <strong>{item.percent}%</strong>
                  <span style={{ width: `${item.percent}%` }} />
                </div>

                <div className={`custom-plan-vehicle-photos${isComplete ? " has-after" : ""}`}>
                  <figure>
                    <img src={imageSrc(item.beforeImage)} alt={`${item.title} 車両全体 改装前`} loading="eager" />
                    <figcaption>改装前</figcaption>
                  </figure>
                  <div className="custom-plan-photo-arrow" aria-hidden="true">
                    <span />
                  </div>
                  {isComplete ? (
                    <figure>
                      <img src={imageSrc(item.afterImage ?? item.beforeImage)} alt={`${item.title} 車両全体 改装後`} loading="eager" />
                      <figcaption>改装後</figcaption>
                    </figure>
                  ) : (
                    <div className="custom-plan-vehicle-photos__pending">
                      <Clock3 aria-hidden="true" size={24} />
                      <strong>全工程完了後に改装後の全体写真を表示</strong>
                    </div>
                  )}
                </div>

                <div className="custom-plan-progress-body">
                  <div className="custom-plan-progress-main">
                    {item.modules.map((module) => {
                      const photo = item.photos.find((entry) => entry.name === module.name);
                      return (
                        <article className="custom-plan-module-card" key={module.name}>
                          <div className="custom-plan-module-card__progress">
                            <div>
                              <strong>{module.name}</strong>
                              <span>{module.status}</span>
                            </div>
                            <p>{module.note}</p>
                            <div className="custom-plan-module-meter">
                              <span style={{ width: `${module.percent}%` }} />
                            </div>
                            <small>{module.percent}%</small>
                          </div>
                          {photo ? (
                            <div className="custom-plan-photo-card">
                              <div className="custom-plan-photo-pair">
                                <figure>
                                  <img src={imageSrc(photo.beforeImage ?? item.beforeImage)} alt={`${photo.name} 施工前`} loading="eager" />
                                  <figcaption>Before</figcaption>
                                </figure>
                                {photo.afterImage ? (
                                  <figure>
                                    <img src={imageSrc(photo.afterImage)} alt={`${photo.name} 施工後`} loading="eager" />
                                    <figcaption>After</figcaption>
                                  </figure>
                                ) : (
                                  <div className="custom-plan-photo-card__pending">
                                    <Clock3 aria-hidden="true" size={24} />
                                    <strong>施工完了後に更新</strong>
                                    <small>After写真はまだありません</small>
                                  </div>
                                )}
                              </div>
                              <p>{photo.note}</p>
                            </div>
                          ) : null}
                        </article>
                      );
                    })}
                  </div>

                  <aside className="custom-plan-progress-updates" aria-label={`${item.title}の進度履歴`}>
                    {item.updates.map((update) => (
                      <div className={update.done ? "is-complete" : ""} key={`${item.id}-${update.title}`}>
                        <span>{update.done ? <Check aria-hidden="true" size={15} /> : <Clock3 aria-hidden="true" size={15} />}</span>
                        <small>{update.time}</small>
                        <strong>{update.title}</strong>
                        <p>{update.body}</p>
                      </div>
                    ))}
                  </aside>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function CustomPlanHero() {
  return (
    <section className="custom-plan-hero">
      <div className="container custom-plan-hero__grid">
        <div className="custom-plan-hero__copy">
          <p className="custom-plan-hero__label">CUSTOM ORDER DEMO</p>
          <h1>車両改装プランナー</h1>
          <p>用途と車種から具体的な改装内容を組み合わせ、金額確認まで進めるフロントエンドデモです。</p>
          <div className="custom-plan-hero__metrics" aria-label="デモ指標">
            <span>
              <strong>3</strong> stage
            </span>
            <span>
              <strong>6</strong> category
            </span>
            <span>
              <strong>18</strong> option
            </span>
          </div>
          <div className="custom-plan-hero__actions">
            <Link className="custom-plan-progress-link custom-plan-progress-link--light" href="/custom-plan/progress">
              <Gauge aria-hidden="true" size={18} />
              改装進度を見る
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepProgress({
  activeStep,
  onStepChange,
  readonly,
}: {
  activeStep: number;
  onStepChange?: (step: number) => void;
  readonly?: boolean;
}) {
  return (
    <div className="custom-plan-stepper" aria-label="入力ステップ">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = index === activeStep;
        const isDone = index < activeStep;
        const content = (
          <>
            <span>{isDone ? <Check aria-hidden="true" size={14} /> : index + 1}</span>
            <Icon aria-hidden="true" size={17} />
            <strong>{step.label}</strong>
          </>
        );

        return readonly ? (
          <div className={`custom-plan-stepper__item${isActive ? " is-active" : ""}${isDone ? " is-done" : ""}`} key={step.label}>
            {content}
          </div>
        ) : (
          <button
            className={`custom-plan-stepper__item${isActive ? " is-active" : ""}${isDone ? " is-done" : ""}`}
            key={step.label}
            type="button"
            onClick={() => onStepChange?.(index)}
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}

function SelectedSummary({
  compact,
  onRemove,
  selectedItems,
  totalPrice,
}: {
  compact: boolean;
  onRemove: (id: string) => void;
  selectedItems: SelectedCustom[];
  totalPrice: number;
}) {
  return (
    <aside className={`custom-plan-selected${compact ? " custom-plan-selected--compact" : ""}`} aria-label="選択済み改装項目">
      <div className="custom-plan-selected__head">
        <span>SELECTED</span>
        <strong>{selectedItems.length}件</strong>
      </div>
      {selectedItems.length === 0 ? (
        <p className="custom-plan-selected__empty">中央の詳細項目から選択してください。</p>
      ) : (
        <div className="custom-plan-selected__list">
          {selectedItems.map((item) => (
            <div key={item.key}>
              <button type="button" onClick={() => onRemove(item.key)} aria-label={`${item.variant.name}を削除`}>
                ×
              </button>
              <strong>{item.variant.name}</strong>
              <small>{item.item.name} / {currencyFormatter.format(item.price)}円</small>
            </div>
          ))}
        </div>
      )}
      <div className="custom-plan-selected__total">
        <span>概算合計</span>
        <strong>{currencyFormatter.format(totalPrice)}円</strong>
      </div>
    </aside>
  );
}

function SelectionGroup({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: string[];
  value: string;
}) {
  return (
    <div className="custom-plan-choice-group">
      <span>{label}</span>
      <div>
        {options.map((option) => (
          <button className={value === option ? "is-selected" : ""} key={option} type="button" onClick={() => onChange(option)}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
