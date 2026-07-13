"use client";

import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styles from "./page.module.css";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"] as const;

// 1日分の体重履歴（未記録の日は weight が null）
type WeightHistoryRow = {
  day: number;
  weight: number | null;
};

// 1ヶ月分の体重履歴（記録が無い月は averageWeight が null）
type MonthlyWeightRow = {
  month: number;
  averageWeight: number | null;
};

// TODO: API接続後は GET /weights から取得する（今はモック値）
const WEIGHT_HISTORY: WeightHistoryRow[] = [
  { day: 1, weight: 68.9 },
  { day: 2, weight: 68.5 },
  { day: 3, weight: 68.7 },
  { day: 4, weight: 68.4 },
  { day: 5, weight: null },
  { day: 6, weight: 68.3 },
  { day: 7, weight: 68.5 },
  { day: 8, weight: 68.2 },
  { day: 9, weight: 68.0 },
  { day: 10, weight: 68.1 },
  { day: 11, weight: null },
  { day: 12, weight: 67.9 },
  { day: 13, weight: 67.8 },
  { day: 14, weight: 68.0 },
  { day: 15, weight: 67.7 },
  { day: 16, weight: 67.5 },
  { day: 17, weight: 67.6 },
  { day: 18, weight: null },
  { day: 19, weight: 67.4 },
  { day: 20, weight: 67.3 },
  { day: 21, weight: 67.5 },
  { day: 22, weight: 67.2 },
  { day: 23, weight: 67.0 },
  { day: 24, weight: 67.1 },
  { day: 25, weight: null },
  { day: 26, weight: 66.9 },
  { day: 27, weight: 66.8 },
  { day: 28, weight: 67.0 },
  { day: 29, weight: 66.7 },
  { day: 30, weight: 66.6 },
  { day: 31, weight: 66.5 },
];

// TODO: API接続後は GET /weights から取得する（今はモック値）
const YEARLY_WEIGHT_HISTORY: MonthlyWeightRow[] = [
  { month: 1, averageWeight: 70.0 },
  { month: 2, averageWeight: 69.7 },
  { month: 3, averageWeight: 69.2 },
  { month: 4, averageWeight: 69.0 },
  { month: 5, averageWeight: null },
  { month: 6, averageWeight: 68.8 },
  { month: 7, averageWeight: 64.4 },
];

export default function WeightsPage() {
  const today = new Date();

  // TODO: API接続後は GET /weights・GET /goals から取得する（今はモック値）
  const currentWeight = 68.4;
  const diffFromYesterday = -0.3;
  const monthlyTargetWeight = 67.0;
  const yearlyTargetWeight = 65.0;
  const monthlyChange = -1.6;
  const yearlyChange = -3.0;

  // ===== 共通ヘルパー（月・年の両方で使う） =====

  // 体重の増減を「▲（増）/▼（減）」で表す。減=緑・増=赤
  const changeMark = (diff: number) => (diff > 0 ? "▲" : diff < 0 ? "▼" : "±");
  const changeClass = (diff: number) =>
    diff > 0 ? styles.up : diff < 0 ? styles.down : "";

  // 体重の引き算は小数誤差（例: 68.7 - 68.5 = 0.1999…）が出るため、
  // 10倍して整数に丸めてから10で割り、小数1桁の正確な値にする
  const weightDiff = (a: number, b: number) => Math.round((a - b) * 10) / 10;

  // グラフのY軸を0.5kg刻みにするため、データの前後0.5kgを0.5の倍数に丸めた範囲と目盛りの一覧を計算
  const makeWeightAxis = (weights: number[]) => {
    const min = Math.floor((Math.min(...weights) - 0.5) * 2) / 2;
    const max = Math.ceil((Math.max(...weights) + 0.5) * 2) / 2;
    const ticks = Array.from(
      { length: Math.round((max - min) * 2) + 1 },
      (_, i) => min + i * 0.5,
    );
    return { min, max, ticks };
  };

  // ===== 月の履歴カード =====

  // 月の履歴カードの表示タブ（履歴 / グラフ）
  const [monthTab, setMonthTab] = useState<"history" | "chart">("history");

  // 月の履歴カードに表示している年月（初期値は今月）
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

  // 月グラフ用のY軸（日々の体重から。未記録日は除いて計算）
  const monthAxis = makeWeightAxis(
    WEIGHT_HISTORY.flatMap((row) => (row.weight !== null ? [row.weight] : [])),
  );

  // ===== 年の履歴カード =====

  // 年の履歴カードの表示タブ（履歴 / グラフ）
  const [yearTab, setYearTab] = useState<"history" | "chart">("history");

  // 年の履歴カードに表示している年（初期値は今年）
  const [displayYear, setDisplayYear] = useState(today.getFullYear());

  // 表示年を delta 年ぶん前後に動かす
  const stepYear = (delta: number) => {
    // TODO: API接続後は年の切り替え時にその年の履歴を取得する
    setDisplayYear((prev) => prev + delta);
  };

  // 年グラフ用のY軸（月別の平均体重から。記録なし月は除いて計算）
  const yearAxis = makeWeightAxis(
    YEARLY_WEIGHT_HISTORY.flatMap((row) =>
      row.averageWeight !== null ? [row.averageWeight] : [],
    ),
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.date}>
          {today.getFullYear()}年{today.getMonth() + 1}月{today.getDate()}
          日（{WEEKDAYS[today.getDay()]}）
        </p>
        <h1 className={styles.title}>ホーム（体重管理）</h1>
      </header>

      {/* 現在の体重 */}
      <div className={styles.currentWeight}>
        <span className={styles.currentWeightValue}>
          {currentWeight.toFixed(1)}
        </span>
        <span className={styles.currentWeightUnit}>kg</span>
        <span
          className={`${styles.weightChange} ${changeClass(diffFromYesterday)}`}
        >
          {changeMark(diffFromYesterday)}
          {Math.abs(diffFromYesterday).toFixed(1)}kg 昨日比
        </span>
      </div>

      {/* サマリーカード */}
      <div className={styles.summaryCards}>
        <section className={styles.summaryCard}>
          <p className={styles.summaryLabel}>今月の目標</p>
          <p className={styles.summaryValue}>
            {monthlyTargetWeight.toFixed(1)} kg
          </p>
        </section>
        <section className={styles.summaryCard}>
          <p className={styles.summaryLabel}>年間の目標</p>
          <p className={styles.summaryValue}>
            {yearlyTargetWeight.toFixed(1)} kg
          </p>
        </section>
        <section className={styles.summaryCard}>
          <p className={styles.summaryLabel}>今月の変化</p>
          <p className={`${styles.summaryValue} ${changeClass(monthlyChange)}`}>
            {changeMark(monthlyChange)}
            {Math.abs(monthlyChange).toFixed(1)} kg
          </p>
        </section>
        <section className={styles.summaryCard}>
          <p className={styles.summaryLabel}>年間の変化</p>
          <p className={`${styles.summaryValue} ${changeClass(yearlyChange)}`}>
            {changeMark(yearlyChange)}
            {Math.abs(yearlyChange).toFixed(1)} kg
          </p>
        </section>
      </div>

      {/* 月の体重履歴 */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>月の体重履歴</h2>

          {/* 月ページャー */}
          <div className={styles.pager}>
            <button
              type="button"
              className={styles.pagerBtn}
              onClick={() => stepMonth(-1)}
              aria-label="前の月へ"
            >
              ‹
            </button>
            <span className={styles.pagerLabel}>
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

        {/* 履歴 / グラフ タブ */}
        <div className={styles.subTabs}>
          <button
            type="button"
            className={`${styles.subTab} ${monthTab === "history" ? styles.subTabActive : ""}`}
            onClick={() => setMonthTab("history")}
          >
            履歴
          </button>
          <button
            type="button"
            className={`${styles.subTab} ${monthTab === "chart" ? styles.subTabActive : ""}`}
            onClick={() => setMonthTab("chart")}
          >
            グラフ
          </button>
        </div>

        {monthTab === "history" ? (
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>日付</th>
                  <th className={styles.th}>体重</th>
                  <th className={styles.th}>前日比</th>
                  <th className={styles.th}>今月の目標まで</th>
                </tr>
              </thead>
              <tbody>
                {WEIGHT_HISTORY.map((row, index) => {
                  // 体重の入力が無ければ「未記録」。前日比・残りは導出値なので空欄

                  // 前日比を出すため1つ前の日の体重を取る（先頭行 or 前日未記録なら null）
                  const prevWeight = WEIGHT_HISTORY[index - 1]?.weight ?? null;
                  const diffFromPrev =
                    row.weight !== null && prevWeight !== null
                      ? weightDiff(row.weight, prevWeight)
                      : null;
                  const remaining =
                    row.weight !== null
                      ? weightDiff(row.weight, monthlyTargetWeight)
                      : null;

                  return (
                    <tr key={row.day} className={styles.tr}>
                      <td className={styles.td}>
                        {month}月{row.day}日（{weekdayOf(row.day)}）
                      </td>
                      <td
                        className={`${styles.td} ${row.weight === null ? styles.noRecord : styles.weight}`}
                      >
                        {row.weight !== null
                          ? `${row.weight.toFixed(1)} kg`
                          : "未記録"}
                      </td>
                      <td className={styles.td}>
                        {diffFromPrev !== null && (
                          <span className={changeClass(diffFromPrev)}>
                            {changeMark(diffFromPrev)}
                            {Math.abs(diffFromPrev).toFixed(1)}
                          </span>
                        )}
                      </td>
                      <td className={styles.td}>
                        {remaining !== null &&
                          (remaining > 0 ? (
                            <span className={styles.remaining}>
                              残り {remaining.toFixed(1)} kg
                            </span>
                          ) : (
                            <span className={styles.achieved}>達成</span>
                          ))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={WEIGHT_HISTORY}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eef0f2" />
              <XAxis
                dataKey="day"
                tickFormatter={(day) => `${day}日`}
                fontSize={12}
                tickLine={false}
              />
              {/* 体重を0.5kg刻みの目盛りで描く */}
              <YAxis
                domain={[monthAxis.min, monthAxis.max]}
                ticks={monthAxis.ticks}
                fontSize={12}
                tickLine={false}
                width={40}
              />
              <Tooltip
                formatter={(value) => [`${value} kg`, "体重"]}
                labelFormatter={(day) => `${month}月${day}日`}
              />
              {/* 今月の目標体重の基準線 */}
              <ReferenceLine
                y={monthlyTargetWeight}
                stroke="#6b7280"
                strokeDasharray="4 4"
                label={{
                  value: `目標 ${monthlyTargetWeight.toFixed(1)}`,
                  position: "insideTopRight",
                  fontSize: 12,
                  fill: "#6b7280",
                }}
              />
              {/* connectNulls: 未記録日は点を打たず、前後の記録を線で繋ぐ */}
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#1d4ed8"
                strokeWidth={2}
                dot={{ r: 2 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </section>

      {/* 年の体重履歴 */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>年の体重履歴</h2>

          {/* 年ページャー */}
          <div className={styles.pager}>
            <button
              type="button"
              className={styles.pagerBtn}
              onClick={() => stepYear(-1)}
              aria-label="前の年へ"
            >
              ‹
            </button>
            <span className={styles.pagerLabel}>{displayYear}年</span>
            <button
              type="button"
              className={styles.pagerBtn}
              onClick={() => stepYear(1)}
              aria-label="次の年へ"
            >
              ›
            </button>
          </div>
        </div>

        {/* 履歴 / グラフ タブ */}
        <div className={styles.subTabs}>
          <button
            type="button"
            className={`${styles.subTab} ${yearTab === "history" ? styles.subTabActive : ""}`}
            onClick={() => setYearTab("history")}
          >
            履歴
          </button>
          <button
            type="button"
            className={`${styles.subTab} ${yearTab === "chart" ? styles.subTabActive : ""}`}
            onClick={() => setYearTab("chart")}
          >
            グラフ
          </button>
        </div>

        {yearTab === "history" ? (
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>月</th>
                  <th className={styles.th}>平均体重</th>
                  <th className={styles.th}>前月比</th>
                  <th className={styles.th}>年間目標まで</th>
                </tr>
              </thead>
              <tbody>
                {YEARLY_WEIGHT_HISTORY.map((row, index) => {
                  // 平均体重はその月の記録から計算する。月内に記録が1件も無ければ「記録なし」、
                  // 前月比・残りも計算できないので空欄

                  // 前月比を出すため1つ前の月の平均体重を取る（先頭行 or 前月が記録なしなら null）
                  const prevAverage =
                    YEARLY_WEIGHT_HISTORY[index - 1]?.averageWeight ?? null;
                  const diffFromPrevMonth =
                    row.averageWeight !== null && prevAverage !== null
                      ? weightDiff(row.averageWeight, prevAverage)
                      : null;
                  const remaining =
                    row.averageWeight !== null
                      ? weightDiff(row.averageWeight, yearlyTargetWeight)
                      : null;

                  return (
                    <tr key={row.month} className={styles.tr}>
                      <td className={styles.td}>{row.month}月</td>
                      <td
                        className={`${styles.td} ${row.averageWeight === null ? styles.noRecord : styles.weight}`}
                      >
                        {row.averageWeight !== null
                          ? `${row.averageWeight.toFixed(1)} kg`
                          : "記録なし"}
                      </td>
                      <td className={styles.td}>
                        {diffFromPrevMonth !== null && (
                          <span className={changeClass(diffFromPrevMonth)}>
                            {changeMark(diffFromPrevMonth)}
                            {Math.abs(diffFromPrevMonth).toFixed(1)}
                          </span>
                        )}
                      </td>
                      <td className={styles.td}>
                        {remaining !== null &&
                          (remaining > 0 ? (
                            <span className={styles.remaining}>
                              残り {remaining.toFixed(1)} kg
                            </span>
                          ) : (
                            <span className={styles.achieved}>達成</span>
                          ))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={YEARLY_WEIGHT_HISTORY}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eef0f2" />
              <XAxis
                dataKey="month"
                tickFormatter={(m) => `${m}月`}
                fontSize={12}
                tickLine={false}
              />
              {/* 体重を0.5kg刻みの目盛りで描く */}
              <YAxis
                domain={[yearAxis.min, yearAxis.max]}
                ticks={yearAxis.ticks}
                fontSize={12}
                tickLine={false}
                width={40}
              />
              <Tooltip
                formatter={(value) => [`${value} kg`, "平均体重"]}
                labelFormatter={(m) => `${displayYear}年${m}月`}
              />
              {/* 年間の目標体重の基準線 */}
              <ReferenceLine
                y={yearlyTargetWeight}
                stroke="#6b7280"
                strokeDasharray="4 4"
                label={{
                  value: `目標 ${yearlyTargetWeight.toFixed(1)}`,
                  position: "insideTopRight",
                  fontSize: 12,
                  fill: "#6b7280",
                }}
              />
              {/* connectNulls: 記録なしの月は点を打たず、前後の月を線で繋ぐ */}
              <Line
                type="monotone"
                dataKey="averageWeight"
                stroke="#1d4ed8"
                strokeWidth={2}
                dot={{ r: 2 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </section>
    </div>
  );
}
