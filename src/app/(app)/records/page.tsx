"use client";

import { useState } from "react";
import styles from "./page.module.css";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"] as const;

export default function RecordPage() {
  const today = new Date();

  // どのタブを表示しているか（実績 / 目標）
  const [tab, setTab] = useState<"actual" | "goal">("actual");

  // 記録日
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [day, setDay] = useState(today.getDate());

  // 体重（0.1kg刻みで上下）
  const [weight, setWeight] = useState(60.0);

  // 食事
  const [calories, setCalories] = useState("");
  const [mealMemo, setMealMemo] = useState("");

  // 運動
  const [exerciseMenu, setExerciseMenu] = useState("");
  const [exerciseMemo, setExerciseMemo] = useState("");

  // 目標（PUT /goals に対応）
  const [dietMode, setDietMode] = useState<"loss" | "gain">("loss");
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState("");
  const [monthlyExerciseGoal, setMonthlyExerciseGoal] = useState("");
  const [monthlyTargetWeight, setMonthlyTargetWeight] = useState("");
  const [yearlyTargetWeight, setYearlyTargetWeight] = useState("");

  const stepWeight = (delta: number) => {
    // 小数の計算誤差（例: 60.1 + 0.1 = 60.199999…）を防ぐため、
    // 10倍して整数に丸めてから10で割り、小数1桁の正確な値にする
    setWeight((prev) => Math.round((prev + delta) * 10) / 10);
  };

  const handleSaveActual = () => {
    // TODO: ここで POST /records を呼ぶ（API接続は次のステップ）
    alert("保存処理はこれから繋ぐ");
  };

  const handleSaveGoals = () => {
    // TODO: ここで PUT /goals を呼ぶ（API接続は次のステップ）
    alert("目標の保存処理はこれから繋ぐ");
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.date}>
          {today.getFullYear()}年{today.getMonth() + 1}月{today.getDate()}日（
          {WEEKDAYS[today.getDay()]}）
        </p>
        <h1 className={styles.title}>記録</h1>
      </header>

      {/* 実績 / 目標 タブ */}
      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${tab === "actual" ? styles.tabActive : ""}`}
          onClick={() => setTab("actual")}
        >
          実績
        </button>
        <button
          type="button"
          className={`${styles.tab} ${tab === "goal" ? styles.tabActive : ""}`}
          onClick={() => setTab("goal")}
        >
          目標
        </button>
      </div>

      {tab === "actual" ? (
        <div className={styles.cards}>
          {/* 記録日 */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>記録日</h2>
            <div className={styles.row}>
              <label className={styles.label}>日付</label>
              <div className={styles.dateInputs}>
                <input
                  type="number"
                  className={styles.numInput}
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                />
                <span className={styles.unit}>年</span>
                <input
                  type="number"
                  className={styles.numInputSm}
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                />
                <span className={styles.unit}>月</span>
                <input
                  type="number"
                  className={styles.numInputSm}
                  value={day}
                  onChange={(e) => setDay(Number(e.target.value))}
                />
                <span className={styles.unit}>日</span>
              </div>
            </div>
          </section>

          {/* 体重 */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>体重</h2>
            <div className={styles.row}>
              <label className={styles.label}>体重</label>
              <div className={styles.weightControl}>
                <span className={styles.weightValue}>{weight.toFixed(1)}</span>
                <span className={styles.unit}>kg</span>
                <div className={styles.spinner}>
                  <button
                    type="button"
                    className={styles.spinnerBtn}
                    onClick={() => stepWeight(0.1)}
                    aria-label="体重を増やす"
                  >
                    ∧
                  </button>
                  <button
                    type="button"
                    className={styles.spinnerBtn}
                    onClick={() => stepWeight(-0.1)}
                    aria-label="体重を減らす"
                  >
                    ∨
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 食事 */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>食事</h2>
            <div className={styles.row}>
              <label className={styles.label}>摂取カロリー</label>
              <div className={styles.inlineField}>
                <input
                  type="number"
                  className={styles.textInputSm}
                  placeholder="例: 1800"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                />
                <span className={styles.unit}>kcal</span>
              </div>
            </div>
            <div className={styles.row}>
              <label className={styles.label}>メモ</label>
              <textarea
                className={styles.textarea}
                placeholder="朝食・昼食・夕食の内容など"
                value={mealMemo}
                onChange={(e) => setMealMemo(e.target.value)}
              />
            </div>
          </section>

          {/* 運動 */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>運動</h2>
            <div className={styles.row}>
              <label className={styles.label}>メニュー</label>
              <input
                type="text"
                className={styles.textInput}
                placeholder="例: ランニング 30分"
                value={exerciseMenu}
                onChange={(e) => setExerciseMenu(e.target.value)}
              />
            </div>
            <div className={styles.row}>
              <label className={styles.label}>メモ</label>
              <textarea
                className={styles.textarea}
                placeholder="体調・強度など"
                value={exerciseMemo}
                onChange={(e) => setExerciseMemo(e.target.value)}
              />
            </div>
          </section>

          {/* 操作ボタン */}
          <div className={styles.actions}>
            {/* TODO: キャンセルの挙動は未定（入力クリア or 前画面に戻る）。画面遷移・API接続を入れるタイミングで決める */}
            <button type="button" className={styles.cancelBtn}>
              キャンセル
            </button>
            <button
              type="button"
              className={styles.saveBtn}
              onClick={handleSaveActual}
            >
              保存する
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.cards}>
          {/* ダイエット設定 */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>ダイエット設定</h2>
            <div className={styles.row}>
              <label className={styles.label}>モード</label>
              <div className={styles.inlineField}>
                <select
                  className={styles.textInputSm}
                  value={dietMode}
                  onChange={(e) =>
                    setDietMode(e.target.value as "loss" | "gain")
                  }
                >
                  <option value="loss">減量</option>
                  <option value="gain">増量</option>
                </select>
              </div>
            </div>
            <div className={styles.row}>
              <label className={styles.label}>目標カロリー</label>
              <div className={styles.inlineField}>
                <input
                  type="number"
                  className={styles.textInputSm}
                  placeholder="例: 1800"
                  min={500}
                  max={10000}
                  value={dailyCalorieGoal}
                  onChange={(e) => setDailyCalorieGoal(e.target.value)}
                />
                <span className={styles.unit}>kcal / 日</span>
              </div>
            </div>
            <div className={styles.row}>
              <label className={styles.label}>運動日数</label>
              <div className={styles.inlineField}>
                <input
                  type="number"
                  className={styles.textInputSm}
                  placeholder="例: 20"
                  min={0}
                  max={31}
                  value={monthlyExerciseGoal}
                  onChange={(e) => setMonthlyExerciseGoal(e.target.value)}
                />
                <span className={styles.unit}>日 / 月</span>
              </div>
            </div>
          </section>

          {/* 目標体重 */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>目標体重</h2>
            <div className={styles.row}>
              <label className={styles.label}>今月の目標体重</label>
              <div className={styles.inlineField}>
                <input
                  type="number"
                  className={styles.textInputSm}
                  placeholder="例: 65.0"
                  min={40}
                  max={100}
                  step={0.1}
                  value={monthlyTargetWeight}
                  onChange={(e) => setMonthlyTargetWeight(e.target.value)}
                />
                <span className={styles.unit}>kg</span>
              </div>
            </div>
            <div className={styles.row}>
              <label className={styles.label}>年間の目標体重</label>
              <div className={styles.inlineField}>
                <input
                  type="number"
                  className={styles.textInputSm}
                  placeholder="例: 60.0"
                  min={40}
                  max={100}
                  step={0.1}
                  value={yearlyTargetWeight}
                  onChange={(e) => setYearlyTargetWeight(e.target.value)}
                />
                <span className={styles.unit}>kg</span>
              </div>
            </div>
          </section>

          {/* 操作ボタン */}
          <div className={styles.actions}>
            {/* TODO: キャンセルの挙動は未定（入力クリア or 前画面に戻る）。画面遷移・API接続を入れるタイミングで決める */}
            <button type="button" className={styles.cancelBtn}>
              キャンセル
            </button>
            <button
              type="button"
              className={styles.saveBtn}
              onClick={handleSaveGoals}
            >
              保存する
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
