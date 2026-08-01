import styles from "./layout.module.css";

// 認証系画面（ログイン・新規登録・パスワードリセット）の共通レイアウト
export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={styles.layout}>
      <div className={styles.card}>
        <header className={styles.header}>
          <p className={styles.logo}>fit-log</p>
          <p className={styles.tagline}>
            体重・食事・運動を記録して目標を達成しよう
          </p>
        </header>
        {children}
      </div>
    </div>
  );
}
