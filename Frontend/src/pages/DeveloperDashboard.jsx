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
        "187.77.187.252:6525/api/developer/user/issues",
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
        `187.77.187.252:6525/api/developer/issues/${issueId}/status`,
        { status: newStatus },
        { headers: { Authorization: token } }
      );
      setStatus("");
      setSelectedIssue(null);
      setActivePanel(null);
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
        `187.77.187.252:6525/api/reporter/issue/${issueId}`,
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
        `187.77.187.252:6525/api/reporter/issue/${issueId}/comment`,
        { message: commentMessage },
        { headers: { Authorization: token } }
      );
      setCommentMessage("");
      fetchIssueComments(issueId);
    } catch (err) {
      console.log(err);
    }
  };

  const statusCounts = issues.reduce(
    (acc, issue) => {
      const key = issue.status || "open";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    { open: 0, "in-progress": 0, resolved: 0, closed: 0 }
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-100">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gradient-to-b from-purple-600 via-indigo-600 to-blue-600 text-white flex flex-col py-6 px-5">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-white/15 flex items-center justify-center text-xl font-bold">
              T
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-white/70">
                Developer
              </p>
              <p className="text-base font-semibold">Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="space-y-1 text-sm flex-1">
          <p className="text-xs uppercase tracking-wide text-white/50 mb-1">
            Main
          </p>
          <button className="w-full flex items-center gap-3 rounded-lg bg-white/15 px-3 py-2 text-left text-sm font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            Issues
          </button>
        </nav>

        <button
          onClick={handleSignout}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-white/15 px-3 py-2 text-xs font-medium text-white hover:bg-white/20"
        >
          Sign out
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="px-4 md:px-8 py-5 border-b border-slate-200 bg-white flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs text-slate-500">Hi there,</p>
            <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
              Developer Role
            </h1>
          </div>

          <div className="flex items-center gap-3 text-xs lg:text-sm text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Working on {issues.length} assigned issue{issues.length === 1 ? "" : "s"}</span>
          </div>
        </header>

        {/* Content layout */}
        <main className="flex-1 px-4 md:px-8 py-6 flex flex-col lg:flex-row gap-6">
          {/* Issues column */}
          <div className="flex-1 space-y-4">
            <section>
              <h2 className="text-base md:text-lg font-semibold lg:text-lg text-slate-900 mb-3">
                Issues reported to you
              </h2>
              {issues.length === 0 ? (
                <p className="text-xs text-slate-500">
                  No issues have been assigned to you yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {issues.map((issue) => (
                    <div
                      key={issue._id}
                      className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col gap-3"
                    >
                      <div>
                        <h3 className="text-sm lg:text-lg font-semibold text-slate-900">
                          Issue Title: {issue.title}
                        </h3>
                        {issue.description && (
                          <p className="mt-1 text-xs lg:text-sm text-slate-700 line-clamp-3">
                           Issue Description: {issue.description}
                          </p>
                        )}
                        <p className="mt-1 text-[11px] lg:text-sm text-slate-500">
                          Project: {issue.project?.name ?? issue.project}
                        </p>
                      </div>

                      <div className="flex items-center  lg:py-2 justify-between gap-3">
                        <span
                          className={`px-2 py-1 text-[11px] text-sm font-medium rounded-full ${
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
                            className="rounded-full bg-blue-600 px-3 py-1 text-[11px] font-medium text-white hover:bg-blue-700"
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
                            className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-medium text-white hover:bg-slate-950"
                          >
                            Comments
                          </button>
                        </div>
                      </div>

                      {selectedIssue === issue._id && (
                        <div className="mt-3 pt-3 border-t border-slate-100">
                          {activePanel === "status" && (
                            <>
                              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                Change status
                              </label>
                              <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
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
                                className="rounded-lg bg-green-600 px-3 py-2 text-[11px] font-semibold text-white hover:bg-green-700"
                              >
                                Update status
                              </button>
                            </>
                          )}

                          {activePanel === "comments" && (
                            <>
                              <div className="mb-3 max-h-32 overflow-y-auto pr-1 space-y-1">
                                {(commentsByIssueId[issue._id] || []).map(
                                  (c) => (
                                    <div
                                      key={c._id || c.createdAt}
                                      className="text-[11px] text-slate-700"
                                    >
                                      <span className="font-semibold">
                                        {c.user?.name || "User"}:
                                      </span>{" "}
                                      {c.message}
                                    </div>
                                  )
                                )}
                                {(commentsByIssueId[issue._id] || []).length ===
                                  0 && (
                                  <p className="text-[11px] text-slate-400">
                                    No comments yet.
                                  </p>
                                )}
                              </div>

                              <textarea
                                value={commentMessage}
                                onChange={(e) =>
                                  setCommentMessage(e.target.value)
                                }
                                placeholder="Write a comment…"
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                              />
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    addReporterThreadComment(issue._id)
                                  }
                                  className="rounded-lg bg-blue-600 px-3 py-2 text-[11px] font-semibold text-white hover:bg-blue-700"
                                >
                                  Add comment
                                </button>
                                <button
                                  type="button"
                                  onClick={() => fetchIssueComments(issue._id)}
                                  className="rounded-lg bg-slate-100 px-3 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-200"
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
              )}
            </section>
          </div>

          {/* Right column: status summary */}
          <div className="w-full lg:max-w-sm space-y-5">
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <h3 className="text-sm font-semibold lg:text-lg text-slate-900 mb-3">
                Status summary
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-slate-50 px-3 py-3">
                  <p className="text-[11px] lg:text-sm text-slate-500">Open</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {statusCounts.open}
                  </p>
                </div>
                <div className="rounded-xl bg-blue-50 px-3 py-3">
                  <p className="text-[11px] lg:text-sm text-blue-700/80">In progress</p>
                  <p className="text-lg font-semibold text-blue-800">
                    {statusCounts["in-progress"]}
                  </p>
                </div>
                <div className="rounded-xl bg-emerald-50 px-3 py-3">
                  <p className="text-[11px] lg:text-sm text-emerald-700/80">Resolved</p>
                  <p className="text-lg font-semibold text-emerald-800">
                    {statusCounts.resolved}
                  </p>
                </div>
                <div className="rounded-xl bg-rose-50 px-3 py-3">
                  <p className="text-[11px] lg:text-sm text-rose-700/80">Closed</p>
                  <p className="text-lg font-semibold text-rose-800">
                    {statusCounts.closed}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}