import { useEffect, useState } from "react";
import axios from "axios";

export default function ReporterDashboard() {
    const token = localStorage.getItem("token");

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
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError("");

                const [projectsRes, issuesRes, featureRes] = await Promise.all([
                    axios.get("http://localhost:8080/api/reporter/my-projects", {
                        headers: { Authorization: token },
                    }),
                    axios.get("http://localhost:8080/api/reporter/my-issues", {
                        headers: { Authorization: token },
                    }),
                    axios.get("http://localhost:8080/api/reporter/feature-requests", {
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
                "http://localhost:8080/api/reporter/issue",
                {
                    title: issueTitle,
                    description: issueDescription,
                    project: selectedProject
                },
                { headers: { Authorization: token } }
            );

            alert("Issue reported");

        } catch (err) {
            console.log(err);
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
                "http://localhost:8080/api/reporter/feature-request",
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
                "http://localhost:8080/api/reporter/feature-requests",
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
                `http://localhost:8080/api/reporter/feature-request/${requestId}/comment`,
                { message },
                { headers: { Authorization: token } }
            );

            setFeatureComments((prev) => ({ ...prev, [requestId]: "" }));

            const res = await axios.get(
                "http://localhost:8080/api/reporter/feature-requests",
                { headers: { Authorization: token } }
            );
            setFeatureRequests(res.data.requests || []);
        } catch (err) {
            console.error("Failed to add comment on feature request", err);
        }
    };

    return (
        <div className="p-10 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-4">Reporter Dashboard</h1>

            <p className="mb-6 text-gray-700">
                View the projects you are assigned to and track the issues you have
                reported.
            </p>

            <div className="mb-8 bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Feature requests for admin</h2>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
                        onClick={() => setIsFeatureFormOpen((open) => !open)}
                    >
                        {isFeatureFormOpen ? "Close form" : "New feature request"}
                    </button>
                </div>

                {isFeatureFormOpen && (
                    <form onSubmit={handleSubmitFeatureRequest} className="space-y-3">
                        {featureError && (
                            <p className="text-red-600 text-sm">{featureError}</p>
                        )}

                        <input
                            type="text"
                            className="w-full border rounded px-3 py-2 text-sm"
                            placeholder="Short title (e.g. Better dashboard filters)"
                            value={featureTitle}
                            onChange={(e) => setFeatureTitle(e.target.value)}
                        />

                        <textarea
                            className="w-full border rounded px-3 py-2 text-sm"
                            rows={3}
                            placeholder="Describe the feature you would like the admin to add..."
                            value={featureDescription}
                            onChange={(e) => setFeatureDescription(e.target.value)}
                        />

                        <button
                            type="submit"
                            disabled={featureSubmitting}
                            className="bg-green-600 text-white px-4 py-2 rounded text-sm disabled:opacity-60"
                        >
                            {featureSubmitting ? "Submitting..." : "Submit feature request"}
                        </button>
                    </form>
                )}
            </div>

            {loading && <p className="text-gray-600">Loading your data...</p>}
            {error && <p className="text-red-600 mb-4">{error}</p>}

            {!loading && !error && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="bg-white rounded-xl shadow p-6 lg:col-span-1">
                        <h2 className="text-xl font-semibold mb-3">My Projects</h2>

                        {projects.length === 0 ? (
                            <p className="text-gray-600 text-sm">
                                You are not assigned to any projects yet.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {projects.map((project) => (
                                    <div
                                        key={project._id}
                                        className="border border-gray-200 rounded-lg p-3"
                                    >
                                        <h3 className="font-semibold text-gray-800">
                                            {project.name}
                                        </h3>
                                        {project.description && (
                                            <p className="text-sm text-gray-600 mt-1">
                                                {project.description}
                                            </p>
                                        )}
                                        {project.createdBy && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Created by: {project.createdBy.name} (
                                                {project.createdBy.email})
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="bg-white rounded-xl shadow p-6 mb-6">

                        <h2 className="text-xl font-semibold mb-3">
                            Report New Issue
                        </h2>

                        <select
                            className="border p-2 w-full mb-2"
                            onChange={(e) => setSelectedProject(e.target.value)}
                        >

                            <option>Select Project</option>

                            {projects.map(p => (
                                <option key={p._id} value={p._id}>
                                    {p.name}
                                </option>
                            ))}

                        </select>

                        <input
                            placeholder="Issue title"
                            className="border p-2 w-full mb-2"
                            onChange={(e) => setIssueTitle(e.target.value)}
                        />

                        <textarea
                            placeholder="Issue description"
                            className="border p-2 w-full mb-2"
                            onChange={(e) => setIssueDescription(e.target.value)}
                        />

                        <button
                            onClick={submitIssue}
                            className="bg-green-600 text-white px-4 py-2 rounded"
                        >
                            Submit Issue
                        </button>

                    </div>
                    <div className="bg-white rounded-xl shadow p-6 lg:col-span-1">
                        <h2 className="text-xl font-semibold mb-3">My Reported Issues</h2>

                        {issues.length === 0 ? (
                            <p className="text-gray-600 text-sm">
                                You haven&apos;t reported any issues yet.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {issues.map((issue) => (
                                    <div
                                        key={issue._id}
                                        className="border border-gray-200 rounded-lg p-3"
                                    >
                                        <h3 className="font-semibold text-gray-800">
                                            {issue.title}
                                        </h3>

                                        {issue.description && (
                                            <p className="text-sm text-gray-700 mt-1">
                                                {issue.description}
                                            </p>
                                        )}

                                        <p className="text-sm text-gray-600 mt-1">
                                            <span className="font-medium">Status:</span>{" "}
                                            {issue.status}
                                        </p>

                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Priority:</span>{" "}
                                            {issue.priority}
                                        </p>

                                        {issue.project && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Project: {issue.project.name}
                                            </p>
                                        )}

                                        {issue.assignedTo && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Assigned to: {issue.assignedTo.name} (
                                                {issue.assignedTo.email})
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Feature requests list */}
                    <div className="bg-white rounded-xl shadow p-6 lg:col-span-1">
                        <h2 className="text-xl font-semibold mb-3">
                            My Feature Requests
                        </h2>

                        {featureRequests.length === 0 ? (
                            <p className="text-gray-600 text-sm">
                                You haven&apos;t submitted any feature requests yet.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {featureRequests.map((req) => (
                                    <div
                                        key={req._id}
                                        className="border border-gray-200 rounded-lg p-3"
                                    >
                                        <h3 className="font-semibold text-gray-800">
                                            {req.title}
                                        </h3>

                                        {req.description && (
                                            <p className="text-sm text-gray-700 mt-1">
                                                {req.description}
                                            </p>
                                        )}

                                        <p className="text-xs text-gray-500 mt-1">
                                            Status:{" "}
                                            <span className="font-medium capitalize">
                                                {req.status?.replace("-", " ") || "open"}
                                            </span>
                                        </p>

                                        {Array.isArray(req.comments) && req.comments.length > 0 && (
                                            <div className="mt-2 space-y-1">
                                                <p className="text-xs font-semibold text-gray-600">
                                                    Comments
                                                </p>
                                                {req.comments.map((c) => (
                                                    <p
                                                        key={c._id || c.createdAt}
                                                        className="text-xs text-gray-600"
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
                                                className="w-full border rounded px-2 py-1 text-xs"
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
                                                className="mt-1 bg-gray-800 text-white px-3 py-1 rounded text-xs"
                                            >
                                                Post comment
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}