import { useEffect, useState } from "react";
import axios from "axios";

export default function DeveloperDashboard() {
  const token = localStorage.getItem("token");

  const [projects, setProjects] = useState([]);
  const [issues, setIssues] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [status, setStatus] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  // GET PROJECTS
  const fetchProjects = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/developer/projects",
        { headers: { Authorization: token } },
      );

      setProjects(res.data.projects);
    } catch (err) {
      console.log(err);
    }
  };

  // GET ISSUES OF PROJECT
  const fetchIssues = async (projectId) => {
    try {
      console.log(projectId);
      const res = await axios.get(
        `http://localhost:8080/api/developer/projects/${projectId}/issues`,
        { headers: { Authorization: token } },
      );

      setIssues(res.data.issues);
      setSelectedProject(projectId);
    } catch (err) {
      console.log(err);
    }
  };

  // UPDATE ISSUE STATUS
  const updateStatus = async (issueId) => {
    if (!status) {
      alert("Select status");
      return;
    }

    try {
      await axios.patch(
        `http://localhost:8080/api/developer/issues/${issueId}/status`,
        { status },
        { headers: { Authorization: token } },
      );

      setStatus("");
      fetchIssues(selectedProject);
    } catch (err) {
      console.log(err);
    }
  };

  // ADD COMMENT
  const addComment = async (issueId) => {
    if (!comment) {
      alert("Comment required");
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/api/developer/issues/${issueId}/comment`,
        { comment },
        { headers: { Authorization: token } },
      );

      setComment("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-8">Developer Dashboard</h1>

      {/* PROJECTS */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">My Projects</h2>

        <div className="grid grid-cols-3 gap-4">
          {projects.map((project) => (
            <div
              key={project._id}
              onClick={() => fetchIssues(project._id)}
              className="bg-white border rounded-lg p-4 cursor-pointer hover:bg-gray-50 hover:shadow"
            >
              <h3 className="text-lg font-semibold">{project.name}</h3>

              {project.description && (
                <p className="text-sm text-gray-500">{project.description}</p>
              )}

              <p className="text-xs text-gray-400 mt-1">
                Issues: {project.issues ? project.issues.length : 0}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ISSUES */}

      {selectedProject && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Project Issues</h2>

          <div className="grid grid-cols-2 gap-4">
            {issues.map((issue) => (
              <div
                key={issue._id}
                className="bg-white border rounded-lg p-4 shadow-sm"
              >
                <h3 className="font-semibold text-lg">{issue.title}</h3>

                <p className="text-sm text-gray-600 mb-2">
                  {issue.description}
                </p>

                {issue.project && (
                  <p className="text-xs text-gray-500 mb-1">
                    Project: {issue.project.name}
                  </p>
                )}

                {issue.assignedTo && (
                  <p className="text-xs text-gray-500 mb-2">
                    Assigned to: {issue.assignedTo.name} ({issue.assignedTo.email})
                  </p>
                )}

                <p className="text-sm">
                  Priority:{" "}
                  <span className="font-medium">{issue.priority}</span>
                </p>

                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded 
${issue.status === "open" ? "bg-gray-200 text-gray-700" : ""}
${issue.status === "in-progress" ? "bg-blue-200 text-blue-700" : ""}
${issue.status === "resolved" ? "bg-green-200 text-green-700" : ""}
${issue.status === "closed" ? "bg-red-200 text-red-700" : ""}
`}
                  >
                    {issue.status}
                  </span>

                  <button
                    onClick={() => setSelectedIssue(issue._id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Change Status
                  </button>
                </div>

                <button
                  onClick={() => setSelectedIssue(issue._id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  Work
                </button>

                {/* COMMENTS / DISCUSSION */}
                {Array.isArray(issue.comments) && issue.comments.length > 0 && (
                  <div className="mt-3 border-t pt-2">
                    <p className="text-xs font-semibold text-gray-600 mb-1">
                      Discussion
                    </p>
                    <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                      {issue.comments.map((c) => (
                        <p
                          key={c._id || c.createdAt}
                          className="text-xs text-gray-600"
                        >
                          <span className="font-medium">
                            {c.user?.name || "User"}:
                          </span>{" "}
                          {c.comment || c.message}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* WORK PANEL */}
                {selectedIssue === issue._id && (
                  <div className="mt-4 border-t pt-3">
                    <select
                      onChange={(e) => setStatus(e.target.value)}
                      className="border p-2 rounded w-full mb-2"
                    >
                      <option value="">Change Status</option>
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>

                    <button
                      onClick={() => updateStatus(issue._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded mb-3"
                    >
                      Update Status
                    </button>

                    <textarea
                      placeholder="Write comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="border p-2 w-full rounded mb-2"
                    />

                    <button
                      onClick={() => addComment(issue._id)}
                      className="bg-gray-800 text-white px-3 py-1 rounded"
                    >
                      Add Comment
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
