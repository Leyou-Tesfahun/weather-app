export default function UnitToggle({ unit, onToggle }) {
  return (
    <button onClick={onToggle} className="border px-3 py-1 rounded-lg">
      {unit === "metric" ? "°C" : "°F"}
    </button>
  );
}
