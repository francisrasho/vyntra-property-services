// Temporary scaffold placeholder — replaced by the real homepage in later tasks.
// Uses brand tokens so we can visually confirm the Tailwind v4 theme works.
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 text-center">
      <div className="glass rounded-3xl px-10 py-12 shadow-[var(--shadow-glass)]">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gold">
          Vyntra Property Services
        </p>
        <h1 className="mt-4 text-4xl font-bold text-ink sm:text-5xl">
          Scaffold <span className="text-gold">OK</span>
        </h1>
        <p className="mt-4 max-w-md text-ink-600">
          Next.js 15 · TypeScript · Tailwind v4 · brand tokens active. The premium
          homepage is built in the following tasks.
        </p>
      </div>
    </main>
  );
}
