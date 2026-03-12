// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function DeveloperDashboard() {
//   const token = localStorage.getItem("token");

//   const [projects, setProjects] = useState([]);
//   const [issues, setIssues] = useState([]);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [selectedIssue, setSelectedIssue] = useState(null);
//   const [activePanel, setActivePanel] = useState(null); // "status" | "comments"
//   const [status, setStatus] = useState("");
//   const [comment, setComment] = useState("");

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   // GET PROJECTS
//   const fetchProjects = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:8080/api/developer/projects",
//         { headers: { Authorization: token } },
//       );
//       setProjects(res.data.projects);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // GET ISSUES FOR A PROJECT USING /user/issues/:id
//   const fetchIssues = async (projectId) => {
//     try {
//       const res = await axios.get(
//         `http://localhost:8080/api/developer/user/issues/${projectId}`,
//         { headers: { Authorization: token } },
//       );
//       setIssues(res.data.issues || []);
//       setSelectedProject(projectId);
//       setSelectedIssue(null);
//       setActivePanel(null);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // UPDATE ISSUE STATUS
//   const updateStatus = async (issueId) => {
//     if (!status) {
//       alert("Select status");
//       return;
//     }

//     try {
//       await axios.patch(
//         `http://localhost:8080/api/developer/issues/${issueId}/status`,
//         { status },
//         { headers: { Authorization: token } },
//       );

//       setStatus("");
//       if (selectedProject) {
//         fetchIssues(selectedProject);
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // ADD COMMENT
//   const addComment = async (issueId) => {
//     if (!comment) {
//       alert("Comment required");
//       return;
//     }

//     try {
//       await axios.post(
//         `http://localhost:8080/api/developer/issues/${issueId}/comment`,
//         { comment },
//         { headers: { Authorization: token } },
//       );

//       setComment("");
//       if (selectedProject) {
//         fetchIssues(selectedProject);
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-10">
//       <h1 className="text-3xl font-bold mb-8">Developer Dashboard</h1>

//       {/* PROJECTS */}
//       <div className="mb-10">
//         <h2 className="text-xl font-semibold mb-4">My Projects</h2>

//         <div className="grid grid-cols-3 gap-4">
//           {projects.map((value, index) => (
//             <div
//               key={index}
//               onClick={() => fetchIssues(value.projectId || value._id)}
//               className="bg-white border rounded-lg p-4 cursor-pointer hover:bg-gray-50 hover:shadow"
//             >
//               <h3 className="text-lg font-semibold">
//                 {value.projectName || value.name}
//               </h3>

//               {(value.description || value.projectDescription) && (
//                 <p className="text-sm text-gray-500">
//                   {value.description || value.projectDescription}
//                 </p>
//               )}

//               <p className="text-xs text-gray-400 mt-1">
//                 Issues: {Array.isArray(value.issues) ? value.issues.length : 0}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ISSUES */}

//       {selectedProject && (
//         <div>
//           <h2 className="text-xl font-semibold mb-4">Project Issues</h2>

//           <div className="grid grid-cols-2 gap-4">
//             {issues.map((issue) => (
//               <div
//                 key={issue._id}
//                 className="bg-white border rounded-lg p-4 shadow-sm"
//               >
//                 <h3 className="font-semibold text-lg">{issue.title}</h3>

//                 <p className="text-sm text-gray-600 mb-2">
//                   {issue.description}
//                 </p>

//                 {issue.project && (
//                   <p className="text-xs text-gray-500 mb-1">
//                     Project: {issue.project.name || issue.project}
//                   </p>
//                 )}

//                 <div className="flex items-center justify-between mb-3">
//                   <span className="px-2 py-1 text-xs font-semibold rounded bg-gray-200 text-gray-700">
//                     {issue.status || "open"}
//                   </span>

//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => {
//                         setSelectedIssue(issue._id);
//                         setActivePanel("status");
//                       }}
//                       className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
//                     >
//                       Status
//                     </button>
//                     <button
//                       onClick={() => {
//                         setSelectedIssue(issue._id);
//                         setActivePanel("comments");
//                       }}
//                       className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
//                     >
//                       Comments
//                     </button>
//                   </div>
//                 </div>

//                 {/* COMMENTS LIST */}
//                 {Array.isArray(issue.comments) && issue.comments.length > 0 && (
//                   <div className="mt-3 border-t pt-2">
//                     <p className="text-xs font-semibold text-gray-600 mb-1">
//                       Discussion
//                     </p>
//                     <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
//                       {issue.comments.map((c) => (
//                         <p
//                           key={c._id || c.createdAt}
//                           className="text-xs text-gray-600"
//                         >
//                           <span className="font-medium">
//                             {c.user?.name || "User"}:
//                           </span>{" "}
//                           {c.comment || c.message}
//                         </p>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* STATUS / COMMENTS PANEL */}
//                 {selectedIssue === issue._id && (
//                   <div className="mt-4 border-t pt-3">
//                     {activePanel === "status" && (
//                       <>
//                         <select
//                           onChange={(e) => setStatus(e.target.value)}
//                           value={status}
//                           className="border p-2 rounded w-full mb-2"
//                         >
//                           <option value="">Change Status</option>
//                           <option value="open">Open</option>
//                           <option value="in-progress">In Progress</option>
//                           <option value="resolved">Resolved</option>
//                           <option value="closed">Closed</option>
//                         </select>

//                         <button
//                           onClick={() => updateStatus(issue._id)}
//                           className="bg-green-600 text-white px-3 py-1 rounded mb-3"
//                         >
//                           Update Status
//                         </button>
//                       </>
//                     )}

//                     {activePanel === "comments" && (
//                       <>
//                         <textarea
//                           placeholder="Write comment..."
//                           value={comment}
//                           onChange={(e) => setComment(e.target.value)}
//                           className="border p-2 w-full rounded mb-2"
//                         />

//                         <button
//                           onClick={() => addComment(issue._id)}
//                           className="bg-gray-800 text-white px-3 py-1 rounded"
//                         >
//                           Add Comment
//                         </button>
//                       </>
//                     )}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Status options from issue.model.js enum
const ISSUE_STATUS_OPTIONS = ["open", "in-progress", "resolved", "closed"];

export default function DeveloperDashboard() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [activePanel, setActivePanel] = useState(null); // "status" | "comments"
  const [status, setStatus] = useState("");
  const [commentMessage, setCommentMessage] = useState("");
  const [commentsByIssueId, setCommentsByIssueId] = useState({});

  const handleSignout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  useEffect(() => {
    try {
      fetchIssues();
    } catch (err) {
      console.log(err);
    }
  }, []);

  const fetchIssues = async () => {
    try {
      const res = await axios.get(
        "http://localhost:6525/api/developer/user/issues",
        { headers: { Authorization: token } }
      );
      setIssues(res.data.issues || []);
    } catch (err) {
      console.log(err);
    }
  };

  const updateStatus = async (issueId) => {
    if (!status) {
      alert("Select a status");
      return;
    }
    const newStatus = status;
    try {
      await axios.patch(
        `http://localhost:6525/api/developer/issues/${issueId}/status`,
        { status: newStatus },
        { headers: { Authorization: token } }
      );
      setStatus("");
      setSelectedIssue(null);
      setActivePanel(null);
      // Update UI immediately so status badge reflects new value
      setIssues((prev) =>
        prev.map((issue) =>
          issue._id === issueId ? { ...issue, status: newStatus } : issue
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  const fetchIssueComments = async (issueId) => {
    try {
      const res = await axios.get(
        `http://localhost:6525/api/reporter/issue/${issueId}`,
        { headers: { Authorization: token } }
      );
      setCommentsByIssueId((prev) => ({
        ...prev,
        [issueId]: Array.isArray(res.data.comments) ? res.data.comments : [],
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const addReporterThreadComment = async (issueId) => {
    if (!commentMessage.trim()) {
      alert("Comment required");
      return;
    }
    try {
      await axios.post(
        `http://localhost:6525/api/reporter/issue/${issueId}/comment`,
        { message: commentMessage },
        { headers: { Authorization: token } }
      );
      setCommentMessage("");
      fetchIssueComments(issueId);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Developer Dashboard</h1>
        <button
          type="button"
          onClick={handleSignout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Sign out
        </button>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {issues.map((issue) => (
          <div key={issue._id} className="bg-white p-5 shadow rounded">
            <h3 className="text-lg font-semibold">{issue.title}</h3>

            <p className="text-gray-600">{issue.description}</p>

            <p className="text-sm text-gray-400">
              Project : {issue.project?.name ?? issue.project}
            </p>

            <div className="flex items-center justify-between mt-3 gap-2">
              <span
                className={`px-2 py-1 text-xs font-medium rounded ${
                  issue.status === "open"
                    ? "bg-gray-200 text-gray-700"
                    : issue.status === "in-progress"
                    ? "bg-blue-200 text-blue-700"
                    : issue.status === "resolved"
                    ? "bg-green-200 text-green-700"
                    : "bg-red-200 text-red-700"
                }`}
              >
                {issue.status || "open"}
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const nextSelected =
                      selectedIssue === issue._id ? null : issue._id;
                    setSelectedIssue(nextSelected);
                    setActivePanel(nextSelected ? "status" : null);
                    setStatus(issue.status || "");
                  }}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
                >
                  Status
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const nextSelected =
                      selectedIssue === issue._id ? null : issue._id;
                    setSelectedIssue(nextSelected);
                    setActivePanel(nextSelected ? "comments" : null);
                    if (nextSelected) fetchIssueComments(issue._id);
                  }}
                  className="bg-gray-800 text-white px-3 py-1.5 rounded text-sm hover:bg-gray-900"
                >
                  Comments
                </button>
              </div>
            </div>

            {selectedIssue === issue._id && (
              <div className="mt-4 pt-3 border-t">
                {activePanel === "status" && (
                  <>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Change status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="border rounded px-3 py-2 w-full mb-2 text-sm"
                    >
                      {ISSUE_STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => updateStatus(issue._id)}
                      className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700"
                    >
                      Update Status
                    </button>
                  </>
                )}

                {activePanel === "comments" && (
                  <>
                    <div className="mb-3 max-h-40 overflow-y-auto pr-1 space-y-2">
                      {(commentsByIssueId[issue._id] || []).map((c) => (
                        <div
                          key={c._id || c.createdAt}
                          className="text-sm text-gray-700"
                        >
                          <span className="font-semibold">
                            {c.user?.name || "User"}:
                          </span>{" "}
                          {c.message}
                        </div>
                      ))}
                      {(commentsByIssueId[issue._id] || []).length === 0 && (
                        <p className="text-sm text-gray-500">
                          No comments yet.
                        </p>
                      )}
                    </div>

                    <textarea
                      value={commentMessage}
                      onChange={(e) => setCommentMessage(e.target.value)}
                      placeholder="Write a comment…"
                      className="border rounded px-3 py-2 w-full mb-2 text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => addReporterThreadComment(issue._id)}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
                      >
                        Add Comment
                      </button>
                      <button
                        type="button"
                        onClick={() => fetchIssueComments(issue._id)}
                        className="bg-gray-200 text-gray-800 px-3 py-1.5 rounded text-sm hover:bg-gray-300"
                      >
                        Refresh
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}