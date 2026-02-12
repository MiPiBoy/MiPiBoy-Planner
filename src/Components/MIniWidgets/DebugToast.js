// DebugToast.jsx
import { useEffect, useState } from "react";

export default function DebugToast({ status, error, success, countdown }) {
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const hasContent = !!(status || error || success || countdown);

  useEffect(() => {
    if (hasContent) {
      setVisible(true);
      setFadeOut(false);

      const timer = setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => setVisible(false), 500);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [status, error, success, countdown]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 9999,
        background: "#1a1a2e",
        border: "1px solid #333",
        borderRadius: 12,
        padding: "12px 16px",
        minWidth: 220,
        maxWidth: 320,
        fontFamily: "Vazirmatn, sans-serif",
        fontSize: 13,
        direction: "rtl",
        color: "#ccc",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.3s ease",
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 6, color: "#7c6fff" }}>
        🧪 Debug
      </div>

      {status && (
        <div style={{ color: "#60a5fa", marginBottom: 4 }}>⏳ {status}</div>
      )}
      {error && (
        <div style={{ color: "#f87171", marginBottom: 4 }}>❌ {error}</div>
      )}
      {success && (
        <div style={{ color: "#4ade80", marginBottom: 4 }}>✅ {success}</div>
      )}
      {countdown > 0 && (
        <div style={{ color: "#facc15" }}>⏱️ {countdown}s</div>
      )}
    </div>
  );
}
