import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ReporterDashboard() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [issues, setIssues] = useState([]);
  const [featureRequests, setFeatureRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isFeatureFormOpen, setIsFeatureFormOpen] = useState(false);
  const [featureTitle, setFeatureTitle] = useState("");
  const [featureDescription, setFeatureDescription] = useState("");
  const [featureSubmitting, setFeatureSubmitting] = useState(false);
  const [featureError, setFeatureError] = useState("");
  const [featureComments, setFeatureComments] = useState({});

  const [issueTitle, setIssueTitle] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [issueCommentsById, setIssueCommentsById] = useState({});
  const [activeIssueId, setActiveIssueId] = useState(null);

  const [view, setView] = useState("overview");

  const handleSignout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [projectsRes, issuesRes, featureRes] = await Promise.all([
          axios.get("187.77.187.252:6525/api/reporter/my-projects", {
            headers: { Authorization: token },
          }),
          axios.get("187.77.187.252:6525/api/reporter/my-issues", {
            headers: { Authorization: token },
          }),
          axios.get("187.77.187.252:6525/api/reporter/feature-requests", {
            headers: { Authorization: token },
          }),
        ]);

        setProjects(projectsRes.data.projects || []);
        setIssues(issuesRes.data.issues || []);
        setFeatureRequests(featureRes.data.requests || []);
      } catch (err) {
        setError("Failed to load your projects, issues and feature requests.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token]);

  const submitIssue = async () => {
    try {
      await axios.post(
        "187.77.187.252:6525/api/reporter/issue",
        {
          title: issueTitle,
          description: issueDescription,
          project: selectedProject,
        },
        { headers: { Authorization: token } }
      );

      alert("Issue reported");
      setIssueTitle("");
      setIssueDescription("");
      setSelectedProject("");
    } catch (err) {
      console.log(err);
    }
  };

  const fetchIssueCommentsForReporter = async (issueId) => {
    try {
      const res = await axios.get(
        `187.77.187.252:6525/api/reporter/issue/${issueId}`,
        { headers: { Authorization: token } }
      );
      setIssueCommentsById((prev) => ({
        ...prev,
        [issueId]: Array.isArray(res.data.comments) ? res.data.comments : [],
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitFeatureRequest = async (e) => {
    e.preventDefault();

    if (!featureTitle.trim() || !featureDescription.trim()) {
      setFeatureError("Please provide both a title and description.");
      return;
    }

    try {
      setFeatureSubmitting(true);
      setFeatureError("");

      await axios.post(
        "187.77.187.252:6525/api/reporter/feature-request",
        {
          title: featureTitle,
          description: featureDescription,
        },
        {
          headers: { Authorization: token },
        }
      );

      setFeatureTitle("");
      setFeatureDescription("");
      setIsFeatureFormOpen(false);

      const res = await axios.get(
        "187.77.187.252:6525/api/reporter/feature-requests",
        { headers: { Authorization: token } }
      );
      setFeatureRequests(res.data.requests || []);
    } catch (err) {
      setFeatureError("Failed to submit feature request.");
      console.error(err);
    } finally {
      setFeatureSubmitting(false);
    }
  };

  const handleSubmitFeatureComment = async (requestId) => {
    const message = (featureComments[requestId] || "").trim();
    if (!message) return;

    try {
      await axios.post(
        `187.77.187.252:6525/api/reporter/feature-request/${requestId}/comment`,
        { message },
        { headers: { Authorization: token } }
      );

      setFeatureComments((prev) => ({ ...prev, [requestId]: "" }));

      const res = await axios.get(
        "187.77.187.252:6525/api/reporter/feature-requests",
        { headers: { Authorization: token } }
      );
      setFeatureRequests(res.data.requests || []);
    } catch (err) {
      console.error("Failed to add comment on feature request", err);
    }
  };

  const hasLoaded = !loading && !error;

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
                Reporter
              </p>
              <p className="text-base font-semibold">Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="space-y-1 text-sm flex-1">
          <p className="text-xs uppercase tracking-wide text-white/50 mb-1">
            Main
          </p>
          <button className="w-full flex items-center gap-3 rounded-lg bg-white/15 px-3 py-2 text-left text-sm font-medium"
                            onClick={() => setView("overview")}
>
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            Overview
          </button>
          <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-white/80 hover:bg-white/10"
                            onClick={() => setView("requests")}
>
            <span className="h-2 w-2 rounded-full bg-white/60" />
            Feature requests
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
              Reporter Role
            </h1>
          </div>

        </header>

        {/* Content layout */}
        <main className="flex-1 px-4 md:px-8 py-6 flex flex-col lg:flex-row gap-6">
          {/* Center column */}
          <div className="flex-1 space-y-6">
            {/* View switcher */}
            <section>
              <div className="inline-flex lg:text-sm rounded-full bg-slate-100 p-1 text-xs">
                <button
                  onClick={() => setView("overview")}
                  className={`px-4 py-1.5 rounded-full font-medium transition ${
                    view === "overview"
                      ? "bg-white shadow-sm text-slate-900"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setView("requests")}
                  className={`px-4 py-1.5 rounded-full lg:text-sm font-medium transition ${
                    view === "requests"
                      ? "bg-white shadow-sm text-slate-900"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Feature requests
                </button>
              </div>
            </section>

            {loading && <p className="text-sm text-slate-500">Loading your data...</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}

            {/* Overview: projects, report issue, reported issues */}
            {hasLoaded && view === "overview" && (
              <>
                <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* My projects */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h2 className="text-base font-semibold lg:text-lg text-slate-900 mb-3">
                      My projects
                    </h2>
                    {projects.length === 0 ? (
                      <p className="text-xs text-slate-500">
                        You are not assigned to any projects yet.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {projects.map((project) => (
                          <div
                            key={project._id}
                            className="border border-slate-100 rounded-lg p-3"
                          >
                            <h3 className="text-sm lg:text-lg font-semibold text-slate-900">
                              {project.name}
                            </h3>
                            {project.description && (
                              <p className="text-xs lg:text-sm text-slate-600 mt-1">
                                {project.description}
                              </p>
                            )}
                            {project.createdBy && (
                              <p className="text-[11px] lg:text-sm text-slate-400 mt-1">
                                Created by: {project.createdBy.name} (
                                {project.createdBy.email})
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Report new issue */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h2 className="text-base font-semibold lg:text-lg text-slate-900 mb-3">
                      Report new issue
                    </h2>
                    <div className="space-y-3">
                      <select
                        className="w-full border border-slate-200 rounded-lg lg:text-sm px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={selectedProject}
                        onChange={(e) => setSelectedProject(e.target.value)}
                      >
                        <option value="">Select project</option>
                        {projects.map((p) => (
                          <option key={p._id} value={p._id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                      <input
                        placeholder="Issue title"
                        className="w-full border lg:text-sm border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={issueTitle}
                        onChange={(e) => setIssueTitle(e.target.value)}
                      />
                      <textarea
                        placeholder="Describe the issue"
                        className="w-full border border-slate-200 lg:text-sm rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        value={issueDescription}
                        onChange={(e) => setIssueDescription(e.target.value)}
                      />
                      <button
                        onClick={submitIssue}
                        className="w-full rounded-lg bg-blue-600 lg:text-sm px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition"
                      >
                        Submit issue
                      </button>
                    </div>
                  </div>
                </section>

                {/* My reported issues with developer updates */}
                <section>
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h2 className="text-base lg:text-lg font-semibold text-slate-900 mb-1">
                      My reported issues
                    </h2>
                    <p className="text-[11px] lg:text-sm text-slate-500 mb-3">
                      See status and developer updates on the issues you reported.
                    </p>

                    {issues.length === 0 ? (
                      <p className="text-xs text-slate-500">
                        You have not reported any issues yet.
                      </p>
                    ) : (
                      <div className="space-y-3 grid grid-cols-1 md:grid-cols-3 gap-5">
                        {issues.map((issue) => (
                          <div
                            key={issue._id}
                            className="border border-slate-100 rounded-lg p-3"
                          >
                            <h3 className="text-sm lg:text-lg font-semibold text-slate-900">
                              {issue.title}
                            </h3>

                            {issue.description && (
                              <p className="text-xs lg:text-sm text-slate-700 mt-1">
                                {issue.description}
                              </p>
                            )}

                            <p className="text-xs text-slate-600 lg:text-sm mt-1">
                              <span className="font-medium">Status:</span>{" "}
                              {issue.status}
                            </p>
                            <p className="text-xs text-slate-600 lg:text-sm">
                              <span className="font-medium">Priority:</span>{" "}
                              {issue.priority}
                            </p>

                            {issue.project && (
                              <p className="text-[11px] lg:text-sm text-slate-400 mt-1">
                                Project: {issue.project.name}
                              </p>
                            )}

                            {issue.assignedTo && (
                              <p className="text-[11px] text-slate-400 mt-1">
                                Assigned to: {issue.assignedTo.name} (
                                {issue.assignedTo.email})
                              </p>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                const nextId =
                                  activeIssueId === issue._id ? null : issue._id;
                                setActiveIssueId(nextId);
                                if (nextId) {
                                  fetchIssueCommentsForReporter(issue._id);
                                }
                              }}
                              className="mt-3 rounded-full lg:text-sm bg-slate-900 text-white px-3 py-1 text-[11px]"
                            >
                              {activeIssueId === issue._id
                                ? "Hide updates"
                                : "View developer updates"}
                            </button>

                            {activeIssueId === issue._id && (
                              <div className="mt-3 border-t border-slate-100 pt-2">
                                <h4 className="text-[11px] lg:text-sm font-semibold text-slate-700 mb-1">
                                  Conversation with developers
                                </h4>
                                <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                                  {(issueCommentsById[issue._id] || []).map(
                                    (c) => (
                                      <p
                                        key={c._id || c.createdAt}
                                        className="text-[11px] lg:text-sm text-slate-600"
                                      >
                                        <span className="font-medium">
                                          {c.user?.name || "User"}:
                                        </span>{" "}
                                        {c.message || c.comment}
                                      </p>
                                    )
                                  )}
                                  {(issueCommentsById[issue._id] || []).length ===
                                    0 && (
                                    <p className="text-[11px] lg:text-sm text-slate-400">
                                      No updates from developers yet.
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              </>
            )}

            {/* Feature requests tab */}
            {hasLoaded && view === "requests" && (
              <section className="space-y-4">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                    <div>
                      <h2 className="text-base lg:text-lg font-semibold text-slate-900">
                        Feature requests for admin
                      </h2>
                      <p className="text-[11px] lg:text-sm text-slate-500">
                        Suggest improvements or new functionality for the tracking
                        portal.
                      </p>
                    </div>
                    <button
                      className="rounded-full bg-blue-600 lg:text-sm px-4 py-2 text-xs font-medium text-white hover:bg-blue-700"
                      onClick={() => setIsFeatureFormOpen((open) => !open)}
                    >
                      {isFeatureFormOpen ? "Close form" : "New feature request"}
                    </button>
                  </div>

                  {isFeatureFormOpen && (
                    <form
                      onSubmit={handleSubmitFeatureRequest}
                      className="space-y-3"
                    >
                      {featureError && (
                        <p className="text-xs lg:text-sm text-red-600">{featureError}</p>
                      )}

                      <input
                        type="text"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Short title (e.g. Better dashboard filters)"
                        value={featureTitle}
                        onChange={(e) => setFeatureTitle(e.target.value)}
                      />

                      <textarea
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        placeholder="Describe the feature you would like the admin to add..."
                        value={featureDescription}
                        onChange={(e) =>
                          setFeatureDescription(e.target.value)
                        }
                      />

                      <button
                        type="submit"
                        disabled={featureSubmitting}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                      >
                        {featureSubmitting
                          ? "Submitting..."
                          : "Submit feature request"}
                      </button>
                    </form>
                  )}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h2 className="text-base lg:text-lg font-semibold text-slate-900 mb-3">
                    My feature requests
                  </h2>
                  {featureRequests.length === 0 ? (
                    <p className="text-xs lg:text-sm text-slate-500">
                      You have not submitted any feature requests yet.
                    </p>
                  ) : (
                    <div className="space-y-4 grid grid-cols-1 md:grid-cols-3 gap-5">
                      {featureRequests.map((req) => (
                        <div
                          key={req._id}
                          className="border border-slate-100 rounded-lg p-3"
                        >
                          <h3 className="text-sm font-semibold text-slate-900">
                            {req.title}
                          </h3>

                          {req.description && (
                            <p className="text-xs text-slate-700 mt-1">
                              {req.description}
                            </p>
                          )}

                          <p className="text-[11px] lg:text-sm text-slate-500 mt-1">
                            Status:{" "}
                            <span className="font-medium capitalize">
                              {req.status?.replace("-", " ") || "open"}
                            </span>
                          </p>

                          {Array.isArray(req.comments) &&
                            req.comments.length > 0 && (
                              <div className="mt-2 space-y-1">
                                <p className="text-[11px] lg:text-sm font-semibold text-slate-600">
                                  Comments
                                </p>
                                {req.comments.map((c) => (
                                  <p
                                    key={c._id || c.createdAt}
                                    className="text-[11px] lg:text-sm text-slate-600"
                                  >
                                    <span className="font-medium">
                                      {c.user?.name || "User"}:
                                    </span>{" "}
                                    {c.message}
                                  </p>
                                ))}
                              </div>
                            )}

                          <div className="mt-3">
                            <textarea
                              className="w-full border border-slate-200 rounded-lg px-2 py-1 text-[11px] lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              rows={2}
                              placeholder="Add a comment about this request..."
                              value={featureComments[req._id] || ""}
                              onChange={(e) =>
                                setFeatureComments((prev) => ({
                                  ...prev,
                                  [req._id]: e.target.value,
                                }))
                              }
                            />
                            <button
                              onClick={() => handleSubmitFeatureComment(req._id)}
                              className="mt-1 rounded-full bg-slate-900 text-white px-3 py-1 text-[11px] lg:text-sm"
                            >
                              Post comment
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          
        </main>
      </div>
    </div>
  );
}