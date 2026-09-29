import { profile } from '@/content/profile'

/** A trilingual hello for anyone who opens DevTools. */
export function consoleHello() {
  const { email } = profile
  const seal = 'background:#4FD1C5;color:#042522;font:italic 700 22px Georgia,serif;padding:6px 14px;border-radius:8px'
  const body = 'font:14px/1.7 ui-monospace,monospace;color:#8A94A6'
  const strong = 'font:600 14px/1.7 ui-monospace,monospace;color:#4FD1C5'
  console.log(
    `%cQ%c\n\nHey, you're looking at the source! Say hi → %c${email}` +
      `%c\nソースを見てくれてありがとう！お気軽にどうぞ → %c${email}` +
      `%c\nمرحبًا، أنت تنظر إلى الكود! قل مرحبًا ← %c${email}` +
      `%c\n\nBuilt with too much Anki. Try typing “shiritori” on the page.`,
    seal,
    body,
    strong,
    body,
    strong,
    body,
    strong,
    body,
  )
}
