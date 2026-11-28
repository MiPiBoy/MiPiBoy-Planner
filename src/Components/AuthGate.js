import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import "./AuthGate.css";

export default function AuthGate({ children }) {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!alive) return;
      setSession(data?.session ?? null);
      if (sessionError) setError(sessionError.message);
      setChecking(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setChecking(false);
      setError("");
    });

    return () => {
      alive = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    setBusy(true);
    setError("");

    try {
      // CRA's PUBLIC_URL may be an absolute homepage URL, not just a path.
      // Convert it to the GitHub Pages base path before building the OAuth callback.
      const publicUrl = process.env.PUBLIC_URL;
      const basePath = publicUrl
        ? new URL(publicUrl, window.location.origin).pathname
        : window.location.pathname;
      const normalizedPath = basePath.endsWith("/") ? basePath : `${basePath}/`;
      const redirectTo = `${window.location.origin}${normalizedPath}`;

      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo }
      });

      if (authError) throw authError;
    } catch (authError) {
      setError(authError?.message || "ورود با Google انجام نشد. دوباره تلاش کن.");
      setBusy(false);
    }
  };

  const signOut = async () => {
    setBusy(true);
    const { error: authError } = await supabase.auth.signOut();
    if (authError) setError(authError.message);
    setBusy(false);
  };

  if (checking) {
    return <div className="auth-screen" dir="rtl"><div className="auth-card"><div className="auth-spinner" /><p>در حال بررسی وضعیت ورود...</p></div></div>;
  }

  if (!session) {
    return (
      <main className="auth-screen" dir="rtl">
        <section className="auth-card">
          <div className="auth-mark">M</div>
          <p className="auth-eyebrow">MIPIBOY PLANNER</p>
          <h1>برنامه‌ریزی، مخصوص خودت</h1>
          <p className="auth-description">برای دسترسی به وظایف، یادداشت‌ها و برنامه شخصی‌ات وارد حساب کاربری شو.</p>
          <button className="google-signin" onClick={signInWithGoogle} disabled={busy}>
            <svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.73 7.18l7.64 5.93c4.46-4.12 7.13-10.2 7.13-17.58z"/><path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.88.93 7.55 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.87l-7.64-5.93c-2.12 1.43-4.84 2.28-8.26 2.28-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            {busy ? "در حال انتقال به گوگل..." : "ورود با حساب Google"}
          </button>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <p className="auth-footnote">اطلاعات هر حساب به‌صورت خصوصی و جداگانه نگهداری می‌شود.</p>
        </section>
      </main>
    );
  }

  return (
    <>
      <div className="auth-userbar" dir="rtl">
        <span>{session.user?.user_metadata?.full_name || session.user?.email}</span>
        <button onClick={signOut} disabled={busy}>{busy ? "..." : "خروج"}</button>
      </div>
      {children}
    </>
  );
}
