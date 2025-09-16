export default function handler(req, res) {
  // Example: return a list of candidates
  res.status(200).json([
    { id: 1, name: "John Doe", role: "Developer" },
    { id: 2, name: "Jane Smith", role: "Designer" }
  ]);
}
