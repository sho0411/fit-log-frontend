"use client";

import { useState } from "react";
import styles from "./page.module.css";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"] as const;

type Gender = "male" | "female" | "other";

// 基本情報のひとまとまり（本体と下書きで同じ形を使う）
type Profile = {
  name: string;
  gender: Gender;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  height: string;
};

// 表示モードで gender の値を日本語にする対応表
const GENDER_LABEL: Record<Gender, string> = {
  male: "男性",
  female: "女性",
  other: "その他",
};

export default function SettingsPage() {
  const today = new Date();

  // 基本情報（TODO: API接続後は GET /user を初期値にし、PUT で保存する。今はモック値）
  const [profile, setProfile] = useState<Profile>({
    name: "田中 太郎",
    gender: "male",
    birthYear: 1990,
    birthMonth: 1,
    birthDay: 1,
    height: "170",
  });

  // インライン編集の状態と下書き。編集開始時に今の値を下書きへコピーし、
  // 保存で本体に反映・キャンセルなら捨てる
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState<Profile>(profile);

  const startEditProfile = () => {
    setProfileDraft(profile);
    setIsEditingProfile(true);
  };

  const saveProfile = () => {
    // TODO: ここで PUT /user を呼ぶ（API接続は次のステップ）
    setProfile(profileDraft);
    setIsEditingProfile(false);
  };

  // アカウント（TODO: API接続後は GET /user の値を初期値にする。今はモック値）
  const [email, setEmail] = useState("tanaka@example.com");

  // インライン編集の状態と下書き。編集開始時に今の値を下書きへコピーし、
  // 保存で本体に反映・キャンセルなら捨てる（打ちかけの値で本体を汚さない）
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailDraft, setEmailDraft] = useState("");

  const startEditEmail = () => {
    setEmailDraft(email);
    setIsEditingEmail(true);
  };

  const saveEmail = () => {
    // TODO: ここで PUT /user（メールアドレス変更）を呼ぶ
    setEmail(emailDraft);
    setIsEditingEmail(false);
  };

  // パスワード（現在のパスワード＋新しいパスワード2回入力の3点セット）
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const startEditPassword = () => {
    setCurrentPassword("");
    setNewPassword("");
    setNewPasswordConfirm("");
    setIsEditingPassword(true);
  };

  const savePassword = () => {
    // TODO: API接続時に実装する
    //  - 新しいパスワード2つの一致チェック
    //  - 今のパスワードの検証と PUT /user（パスワード変更）
    setIsEditingPassword(false);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.date}>
          {today.getFullYear()}年{today.getMonth() + 1}月{today.getDate()}
          日（{WEEKDAYS[today.getDay()]}）
        </p>
        <h1 className={styles.title}>設定</h1>
      </header>

      {/* 基本情報 */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>基本情報</h2>
          {!isEditingProfile && (
            <button
              type="button"
              className={styles.changeBtn}
              onClick={startEditProfile}
            >
              編集
            </button>
          )}
        </div>

        {isEditingProfile ? (
          <>
            <div className={styles.row}>
              <label className={styles.label}>名前</label>
              <input
                type="text"
                className={styles.textInput}
                value={profileDraft.name}
                onChange={(e) =>
                  setProfileDraft({ ...profileDraft, name: e.target.value })
                }
              />
            </div>

            <div className={styles.row}>
              <label className={styles.label}>性別</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={profileDraft.gender === "male"}
                    onChange={() =>
                      setProfileDraft({ ...profileDraft, gender: "male" })
                    }
                  />
                  男性
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={profileDraft.gender === "female"}
                    onChange={() =>
                      setProfileDraft({ ...profileDraft, gender: "female" })
                    }
                  />
                  女性
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    checked={profileDraft.gender === "other"}
                    onChange={() =>
                      setProfileDraft({ ...profileDraft, gender: "other" })
                    }
                  />
                  その他
                </label>
              </div>
            </div>

            <div className={styles.row}>
              <label className={styles.label}>生年月日</label>
              <div className={styles.dateInputs}>
                <input
                  type="number"
                  className={styles.numInput}
                  value={profileDraft.birthYear}
                  onChange={(e) =>
                    setProfileDraft({
                      ...profileDraft,
                      birthYear: Number(e.target.value),
                    })
                  }
                />
                <span className={styles.unit}>年</span>
                <input
                  type="number"
                  className={styles.numInputSm}
                  value={profileDraft.birthMonth}
                  onChange={(e) =>
                    setProfileDraft({
                      ...profileDraft,
                      birthMonth: Number(e.target.value),
                    })
                  }
                />
                <span className={styles.unit}>月</span>
                <input
                  type="number"
                  className={styles.numInputSm}
                  value={profileDraft.birthDay}
                  onChange={(e) =>
                    setProfileDraft({
                      ...profileDraft,
                      birthDay: Number(e.target.value),
                    })
                  }
                />
                <span className={styles.unit}>日</span>
              </div>
            </div>

            <div className={styles.row}>
              <label className={styles.label}>身長</label>
              <div className={styles.inlineField}>
                <input
                  type="number"
                  className={styles.textInputSm}
                  value={profileDraft.height}
                  onChange={(e) =>
                    setProfileDraft({
                      ...profileDraft,
                      height: e.target.value,
                    })
                  }
                />
                <span className={styles.unit}>cm</span>
              </div>
            </div>

            {/* 操作ボタン */}
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setIsEditingProfile(false)}
              >
                キャンセル
              </button>
              <button
                type="button"
                className={styles.saveBtn}
                onClick={saveProfile}
              >
                保存する
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={styles.row}>
              <span className={styles.label}>名前</span>
              <span className={styles.fieldValue}>{profile.name}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>性別</span>
              <span className={styles.fieldValue}>
                {GENDER_LABEL[profile.gender]}
              </span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>生年月日</span>
              <span className={styles.fieldValue}>
                {profile.birthYear}年{profile.birthMonth}月{profile.birthDay}日
              </span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>身長</span>
              <span className={styles.fieldValue}>{profile.height} cm</span>
            </div>
          </>
        )}
      </section>

      {/* アカウント */}
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>アカウント</h2>
        </div>

        <div className={styles.row}>
          <span className={styles.label}>メールアドレス</span>
          {isEditingEmail ? (
            <>
              <input
                type="email"
                className={styles.accountInput}
                autoComplete="email"
                value={emailDraft}
                onChange={(e) => setEmailDraft(e.target.value)}
              />
              <div className={styles.rowActions}>
                <button
                  type="button"
                  className={styles.changeBtn}
                  onClick={() => setIsEditingEmail(false)}
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  className={styles.saveSmBtn}
                  onClick={saveEmail}
                >
                  保存
                </button>
              </div>
            </>
          ) : (
            <>
              <span className={styles.fieldValue}>{email}</span>
              <button
                type="button"
                className={styles.changeBtn}
                onClick={startEditEmail}
              >
                変更
              </button>
            </>
          )}
        </div>

        <div className={styles.row}>
          <span className={styles.label}>パスワード</span>
          {isEditingPassword ? (
            <>
              <div className={styles.passwordFields}>
                <input
                  type="password"
                  className={styles.accountInput}
                  autoComplete="current-password"
                  placeholder="現在のパスワード"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <input
                  type="password"
                  className={styles.accountInput}
                  autoComplete="new-password"
                  placeholder="新しいパスワード"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                  type="password"
                  className={styles.accountInput}
                  autoComplete="new-password"
                  placeholder="新しいパスワード（確認）"
                  value={newPasswordConfirm}
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                />
              </div>
              <div className={styles.rowActions}>
                <button
                  type="button"
                  className={styles.changeBtn}
                  onClick={() => setIsEditingPassword(false)}
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  className={styles.saveSmBtn}
                  onClick={savePassword}
                >
                  保存
                </button>
              </div>
            </>
          ) : (
            <>
              <span className={styles.fieldValue}>••••••••</span>
              <button
                type="button"
                className={styles.changeBtn}
                onClick={startEditPassword}
              >
                変更
              </button>
            </>
          )}
        </div>
      </section>

      {/* アカウント削除 */}
      <section className={`${styles.card} ${styles.dangerCard}`}>
        <h2 className={styles.dangerTitle}>アカウント削除</h2>
        <p className={styles.dangerText}>
          アカウントを削除すると、すべての記録・設定データが完全に削除されます。この操作は取り消せません。
        </p>
        {/* TODO: API接続時に確認ダイアログと削除処理（DELETE /user）を実装する */}
        <button type="button" className={styles.deleteBtn}>
          アカウントを削除する
        </button>
      </section>
    </div>
  );
}
