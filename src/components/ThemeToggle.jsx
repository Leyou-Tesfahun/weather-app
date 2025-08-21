export default function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      aria-label="Toggle dark mode"
      onClick={onToggle}
      className="text-xl p-2"
    >
      {isDark ? "🌙" : "☀️"}
    </button>
  );
}
