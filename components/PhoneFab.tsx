import styles from "./PhoneFab.module.css";

export function PhoneFab() {
  return (
    <a className={styles.fab} href="tel:15449669" aria-label="전화문의 1544-9669">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C11.4 21 3 12.6 3 2.3c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8Z" />
      </svg>
      <span className={styles.text}>
        <b className={styles.label}>전화문의</b>
        <strong className={styles.number}>1544-9669</strong>
      </span>
    </a>
  );
}
