"use client";

import { useState } from "react";
import styles from "./page.module.css";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"] as const;

// 1日分の食事履歴（未記録の日は calories が null）
type MealHistoryRow = {
  day: number;
  menu: string | null;
  calories: number | null;
};

// TODO: API接続後は GET /records から取得する（今はモック値）
const MEAL_HISTORY: MealHistoryRow[] = [
  { day: 1, menu: "鶏むね肉のサラダ、玄米、味噌汁", calories: 1950 },
  { day: 2, menu: "オートミール、サバの塩焼き、豆腐", calories: 1800 },
  { day: 3, menu: "パスタ、サラダチキン、プロテイン", calories: 2100 },
  { day: 4, menu: "焼き魚定食、ヨーグルト、バナナ", calories: 2000 },
  { day: 5, menu: null, calories: null },
];

type Rating = "good" | "ok" | "warn";

const RATINGS = ["good", "ok", "warn"] as const;

const RATING_MARK: Record<Rating, string> = { good: "◎", ok: "◯", warn: "△" };

// 評価マークの色クラス
const RATING_CLASS: Record<Rating, string> = {
  good: styles.ratingGood,
  ok: styles.ratingOk,
  warn: styles.ratingWarn,
};

// 評価しきい値（目標カロリーに対する%）
// ◎は両モード共通で95〜105%。◯の範囲だけモードで異なる
// TODO: しきい値の仕様は再検討予定（将来: 消費カロリーからの目標自動算出、減量のノーマル/ハード選択）
const GOOD_RANGE = { min: 95, max: 105 } as const;
const OK_RANGE = {
  loss: { min: 85, max: 110 },
  gain: { min: 90, max: 115 },
} as const;

export default function MealsPage() {
  const today = new Date();

  // TODO: API接続後は GET /goals・GET /records から取得する（今はモック値）
  const dailyCalorieGoal = 2000;
  const todayCalories = 1840;
  const monthlyAverageCalories = 1920;

  // ダイエットモード（減量 / 増量）
  const [dietMode, setDietMode] = useState<"loss" | "gain">("loss");

  // 履歴テーブルに表示している月（初期値は今月）
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  // 表示月を delta ヶ月ぶん前後に動かす（1月・12月をまたぐときは年も動かす）
  const stepMonth = (delta: number) => {
    // TODO: API接続後は月の切り替え時にその月の履歴を取得する
    const moved = new Date(year, month - 1 + delta, 1);
    setYear(moved.getFullYear());
    setMonth(moved.getMonth() + 1);
  };

  // 摂取カロリーが目標の何%かで評価を返す（◎は共通、◯の範囲はモードで異なる）
  const rateMeal = (calories: number): Rating => {
    const percent = (calories / dailyCalorieGoal) * 100;
    if (percent >= GOOD_RANGE.min && percent <= GOOD_RANGE.max) return "good";
    const { min, max } = OK_RANGE[dietMode];
    if (percent >= min && percent <= max) return "ok";
    return "warn";
  };

  // 凡例はユーザーが分かりやすいよう、%しきい値をkcalに換算して表示する
  const kcalOf = (percent: number) =>
    Math.round((dailyCalorieGoal * percent) / 100).toLocaleString();

  const okRange = OK_RANGE[dietMode];
  const legendLabel: Record<Rating, string> = {
    good: `${kcalOf(GOOD_RANGE.min)}〜${kcalOf(GOOD_RANGE.max)} kcal`,
    ok: `${kcalOf(okRange.min)}〜${kcalOf(GOOD_RANGE.min)} / ${kcalOf(GOOD_RANGE.max)}〜${kcalOf(okRange.max)} kcal`,
    warn: `${kcalOf(okRange.min)} kcal未満 / ${kcalOf(okRange.max)} kcal超`,
  };

  const weekdayOf = (day: number) =>
    WEEKDAYS[new Date(year, month - 1, day).getDay()];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.date}>
            {today.getFullYear()}年{today.getMonth() + 1}月{today.getDate()}
            日（{WEEKDAYS[today.getDay()]}）
          </p>
          <h1 className={styles.title}>食事管理</h1>
        </div>

        {/* 減量 / 増量 トグル（TODO: API接続後は GET /goals の値を初期値にし、切替時に保存する） */}
        <div className={styles.modeToggle}>
          <button
            type="button"
            className={`${styles.modeBtn} ${dietMode === "loss" ? styles.modeBtnActive : ""}`}
            onClick={() => setDietMode("loss")}
          >
            減量
          </button>
          <button
            type="button"
            className={`${styles.modeBtn} ${dietMode === "gain" ? styles.modeBtnActive : ""}`}
            onClick={() => setDietMode("gain")}
          >
            増量
          </button>
        </div>
      </header>

      {/* サマリーカード */}
      <div className={styles.summaryCards}>
        <section className={styles.summaryCard}>
          <p className={styles.summaryLabel}>1日の目標カロリー</p>
          <p className={styles.summaryValue}>
            {dailyCalorieGoal.toLocaleString()} kcal
          </p>
        </section>
        <section className={styles.summaryCard}>
          <p className={styles.summaryLabel}>今日のカロリー</p>
          <p className={`${styles.summaryValue} ${styles.summaryValuePrimary}`}>
            {todayCalories.toLocaleString()} kcal
          </p>
        </section>
        <section className={styles.summaryCard}>
          <p className={styles.summaryLabel}>今月の1日平均カロリー</p>
          <p className={styles.summaryValue}>
            {monthlyAverageCalories.toLocaleString()} kcal
          </p>
        </section>
      </div>

      {/* 月の食事履歴 */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>月の食事履歴</h2>

          {/* 月ページャー */}
          <div className={styles.monthPager}>
            <button
              type="button"
              className={styles.pagerBtn}
              onClick={() => stepMonth(-1)}
              aria-label="前の月へ"
            >
              ‹
            </button>
            <span className={styles.monthLabel}>
              {year}年{month}月
            </span>
            <button
              type="button"
              className={styles.pagerBtn}
              onClick={() => stepMonth(1)}
              aria-label="次の月へ"
            >
              ›
            </button>
          </div>
        </div>

        {/* 評価の凡例（文言はモードで切り替わる） */}
        <div className={styles.legend}>
          {RATINGS.map((rating) => (
            <span key={rating} className={styles.legendItem}>
              <span className={`${styles.ratingMark} ${RATING_CLASS[rating]}`}>
                {RATING_MARK[rating]}
              </span>
              {legendLabel[rating]}
            </span>
          ))}
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>日付</th>
              <th className={styles.th}>メニュー</th>
              <th className={styles.th}>摂取カロリー</th>
              <th className={styles.th}>評価</th>
              <th className={styles.th}>目標との差</th>
            </tr>
          </thead>
          <tbody>
            {MEAL_HISTORY.map((row) => {
              // 未記録の日はカロリー以降を「未記録」だけにする
              if (row.calories === null) {
                return (
                  <tr key={row.day} className={styles.tr}>
                    <td className={styles.td}>
                      {month}月{row.day}日（{weekdayOf(row.day)}）
                    </td>
                    <td className={`${styles.td} ${styles.noRecord}`}>
                      未記録
                    </td>
                    <td className={styles.td} />
                    <td className={styles.td} />
                    <td className={styles.td} />
                  </tr>
                );
              }

              const diff = row.calories - dailyCalorieGoal;
              const rating = rateMeal(row.calories);

              return (
                <tr key={row.day} className={styles.tr}>
                  <td className={styles.td}>
                    {month}月{row.day}日（{weekdayOf(row.day)}）
                  </td>
                  <td className={styles.td}>{row.menu}</td>
                  <td className={`${styles.td} ${styles.calories}`}>
                    {row.calories.toLocaleString()} kcal
                  </td>
                  <td className={styles.td}>
                    <span
                      className={`${styles.ratingMark} ${RATING_CLASS[rating]}`}
                    >
                      {RATING_MARK[rating]}
                    </span>
                  </td>
                  <td
                    className={`${styles.td} ${
                      diff > 0 ? styles.diffOver : styles.diffUnder
                    }`}
                  >
                    {diff > 0 ? "+" : diff === 0 ? "±" : ""}
                    {diff} kcal
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
