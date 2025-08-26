// src/components/Header.jsx
export default function Header({ title, rightSection }) {
  return (
    <header className="w-full py-4 mb-6 flex items-center justify-between bg-blue-500 text-white rounded-lg shadow-md px-6">
      <div>
        <h1 className="text-2xl font-bold">🌦️ {title || "Weather Dashboard"}</h1>
        <p className="text-sm">Search for any city to see real-time weather</p>
      </div>
      {rightSection && <div>{rightSection}</div>}
    </header>
  );
}
