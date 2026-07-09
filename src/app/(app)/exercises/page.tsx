"use client";

import { useState } from "react";
import styles from "./page.module.css";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"] as const;

// 1日分の運動履歴（未記録の日は menu が null）
type ExerciseHistoryRow = {
  day: number;
  menu: string | null;
  memo: string | null;
};

// TODO: API接続後は GET /exercises から取得する（今はモック値）
const EXERCISE_HISTORY: ExerciseHistoryRow[] = [
  { day: 1, menu: "ランニング 30分", memo: null },
  { day: 2, menu: "ベンチプレス 60kg 10回×3セット", memo: "胸の日" },
  { day: 3, menu: null, memo: null },
  { day: 4, menu: "スクワット 80kg 8回×3セット", memo: "脚の日" },
  { day: 5, menu: "ウォーキング 60分", memo: "疲労抜き" },
  { day: 6, menu: null, memo: "休息日" },
];

export default function ExercisesPage() {
  const today = new Date();

  // TODO: API接続後は GET /exercises から取得する（今はモック値）
  const monthlyExerciseGoal = 20;
  const actualDays = 18;
  const consecutiveDays = 4;

  // 今月の達成率（バックエンドと同じく実績÷目標の四捨五入）
  const achievementRate = Math.round((actualDays / monthlyExerciseGoal) * 100);

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

  const weekdayOf = (day: number) =>
    WEEKDAYS[new Date(year, month - 1, day).getDay()];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.date}>
          {today.getFullYear()}年{today.getMonth() + 1}月{today.getDate()}
          日（{WEEKDAYS[today.getDay()]}）
        </p>
        <h1 className={styles.title}>運動管理</h1>
      </header>

      {/* サマリーカード */}
      <div className={styles.summaryCards}>
        <section className={styles.summaryCard}>
          <p className={styles.summaryLabel}>今月の目標運動日数</p>
          <p className={styles.summaryValue}>{monthlyExerciseGoal}日</p>
        </section>
        <section className={styles.summaryCard}>
          <p className={styles.summaryLabel}>今月の実績運動日数</p>
          <p className={`${styles.summaryValue} ${styles.summaryValuePrimary}`}>
            {actualDays}日
          </p>
        </section>
        <section className={styles.summaryCard}>
          <p className={styles.summaryLabel}>今月の達成率</p>
          <p className={`${styles.summaryValue} ${styles.summaryValueSuccess}`}>
            {achievementRate}%
          </p>
        </section>
        <section className={styles.summaryCard}>
          <p className={styles.summaryLabel}>連続運動日数</p>
          <p className={`${styles.summaryValue} ${styles.summaryValueStreak}`}>
            {consecutiveDays}日
          </p>
        </section>
      </div>

      {/* 月の運動履歴 */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>月の運動履歴</h2>

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

        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>日付</th>
              <th className={styles.th}>メニュー</th>
              <th className={styles.th}>メモ</th>
            </tr>
          </thead>
          <tbody>
            {EXERCISE_HISTORY.map((row) => (
              <tr key={row.day} className={styles.tr}>
                <td className={styles.td}>
                  {month}月{row.day}日（{weekdayOf(row.day)}）
                </td>
                {/* メニューは記録の本体なので無ければ「未記録」、メモは任意項目なので無ければ「—」 */}
                <td
                  className={`${styles.td} ${row.menu === null ? styles.noRecord : styles.menu}`}
                >
                  {row.menu ?? "未記録"}
                </td>
                <td className={`${styles.td} ${styles.memo}`}>
                  {row.memo ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
