export default function handler(req, res) {
  // Example: return a list of jobs
  res.status(200).json([
    { id: 1, title: "Frontend Developer", company: "Acme Corp" },
    { id: 2, title: "Backend Developer", company: "Beta LLC" }
  ]);
}
