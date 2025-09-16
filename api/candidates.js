export default function handler(req, res) {
  res.status(200).json([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
      status: "active",
      archived: false,
      appliedJobs: [1],
      stage: "interview",
      skills: ["React", "JavaScript"],
      experience: "2 years at Acme Corp"
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "0987654321",
      status: "active",
      archived: false,
      appliedJobs: [2],
      stage: "screening",
      skills: ["Design", "Figma"],
      experience: "3 years at Beta LLC"
    }
  ]);
}
