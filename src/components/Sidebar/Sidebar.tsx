"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.css";

/** サイドバーのナビゲーション項目（ユーザー名は今はモック） */
const NAV_ITEMS = [
  { href: "/", label: "ホーム" },
  { href: "/meals", label: "食事管理" },
  { href: "/exercises", label: "運動管理" },
  { href: "/records", label: "記録" },
  { href: "/settings", label: "設定" },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <span className={styles.logo}>fit-log</span>
        <div className={styles.user}>
          <span className={styles.avatar}>田中</span>
          <span className={styles.userName}>田中 太郎</span>
        </div>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => {
          // 今いるURLが、この項目のリンク先と一致すればアクティブ
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ""}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
