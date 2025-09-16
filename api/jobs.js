export default function handler(req, res) {
  res.status(200).json([
    {
      id: 1,
      title: "Frontend Developer",
      department: "Engineering",
      status: "active",
      archived: false,
      description: "Build UI components.",
      requirements: ["React", "JavaScript", "CSS"],
      location: "Remote"
    },
    {
      id: 2,
      title: "Backend Developer",
      department: "Engineering",
      status: "active",
      archived: false,
      description: "Build backend services.",
      requirements: ["Node.js", "Express", "MongoDB"],
      location: "Remote"
    }
  ]);
}
