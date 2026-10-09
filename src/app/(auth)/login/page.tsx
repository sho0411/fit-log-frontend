"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./page.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // TODO: ここで POST /auth/login を呼ぶ（API接続はバックエンドのCookie方式修正後）
    alert("ログイン処理はこれから繋ぐ");
  };

  return (
    <form
      className={styles.login}
      onSubmit={(e) => {
        // フォーム標準の「ページを再読み込みして送信」を止めて、自分の処理に差し替える
        e.preventDefault();
        handleLogin();
      }}
    >
      <h1 className={styles.title}>ログイン</h1>
      <div className={styles.field}>
        <label className={styles.label}>メールアドレス</label>
        <input
          type="email"
          className={styles.input}
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>パスワード</label>
        <input
          type="password"
          className={styles.input}
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <p className={styles.forgotLink}>
        <Link href="/password-reset">パスワードを忘れた方はこちら</Link>
      </p>

      <button type="submit" className={styles.loginBtn}>
        ログイン
      </button>

      <div className={styles.divider}>または</div>

      <p className={styles.registerLink}>
        アカウントをお持ちでない方は <Link href="/register">こちら</Link>
      </p>
    </form>
  );
}
