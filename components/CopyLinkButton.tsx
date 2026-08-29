"use client";
import { useState } from "react";
export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  async function handleClick() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can be unavailable (non-secure context, permissions
      // denied); silently no-op rather than showing a broken button state.
    }
  }
  return <button type="button" className="copy-link" onClick={handleClick}>{copied ? "복사됨" : "링크 복사"}</button>;
}
