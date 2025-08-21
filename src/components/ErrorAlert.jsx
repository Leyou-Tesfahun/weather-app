export default function ErrorAlert({ message }) {
  return (
    <div role="alert" className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full max-w-2xl">
      <strong>Error:</strong> {message}
    </div>
  );
}
