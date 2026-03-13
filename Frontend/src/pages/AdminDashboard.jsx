import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminDashboard() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [view, setView] = useState("projects-create");
  const [projects, setProjects] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [memberPassword, setMemberPassword] = useState("");
  const [role, setRole] = useState("developer");

  const [issueTitle, setIssueTitle] = useState("");
  const [issueDesc, setIssueDesc] = useState("");
  const [priority, setPriority] = useState("medium");
  const [projectId, setProjectId] = useState("");

  const [members, setMembers] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [memberId, setMemberId] = useState("");
  const [allMembers, setAllMembers] = useState([]);

  useEffect(() => {
    fetchProjects();
    fetchMembers();
  }, []);

  const handleSignout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get("https://tracker-backend-o90y.onrender.com/api/admin/projects", {
        headers: { Authorization: token },
      });
      setProjects(res.data.projects);
    } catch (err) {
      console.log(err);
    }
  };

  const createProject = async () => {
    try {
      await axios.post(
        "https://tracker-backend-o90y.onrender.com/api/admin/projects",
        { name, description },
        { headers: { Authorization: token } }
      );
      alert("Project created");
      setName("");
      setDescription("");
      fetchProjects();
    } catch (err) {
      alert("Error creating project");
    }
  };

  const createMember = async () => {
    try {
      await axios.post(
        "https://tracker-backend-o90y.onrender.com/api/admin/members",
        {
          name: memberName,
          email: memberEmail,
          password: memberPassword,
          role,
        },
        { headers: { Authorization: token } }
      );
      alert("Member created");
      setMemberName("");
      setMemberEmail("");
      setMemberPassword("");
      setRole("developer");
    } catch (err) {
      alert("Error creating member");
    }
  };

  const createIssue = async () => {
    try {
      await axios.post(
        "https://tracker-backend-o90y.onrender.com/api/admin/issues",
        {
          title: issueTitle,
          description: issueDesc,
          priority,
          project: projectId,
        },
        { headers: { Authorization: token } }
      );
      alert("Issue created");
      setIssueTitle("");
      setIssueDesc("");
      setPriority("medium");
      setProjectId("");
    } catch (err) {
      alert("Error creating issue");
    }
  };

  const viewMembers = async (projectId) => {
    try {
      const res = await axios.get(
        `https://tracker-backend-o90y.onrender.com/api/admin/projects/${projectId}`,
        { headers: { Authorization: token } }
      );

      setMembers(res.data.members);
      setSelectedProject(projectId);
    } catch (err) {
      console.log(err);
    }
  };

  const addMemberToProject = async () => {
    try {
      await axios.post(
        `https://tracker-backend-o90y.onrender.com/api/admin/projects/${selectedProject}/members`,
        { userId: memberId },
        { headers: { Authorization: token } }
      );

      alert("Member added to project");
    } catch (err) {
      alert("Error adding member");
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await axios.get("https://tracker-backend-o90y.onrender.com/api/admin/members", {
        headers: { Authorization: token },
      });

      setAllMembers(res.data.members);
    } catch (err) {
      console.log(err);
    }
  };

  const trendingMembers = allMembers.slice(0, 4);

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
                Admin
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
                            onClick={() => setView("projects-create")}
>
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            Add Project
          </button>
          <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-white/80 hover:bg-white/10"
                            onClick={() => setView("projects-existing")}
>
            <span className="h-2 w-2 rounded-full bg-white/60" />
            Your Projects
          </button>
          <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-white/80 hover:bg-white/10"
                            onClick={() => setView("members")}
>
            <span className="h-2 w-2 rounded-full bg-white/60" />
            Team Members
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
        <header className="px-8 py-5 border-b border-slate-200 bg-white flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Hi there,</p>
            <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
              Administrator Role
            </h1>
          </div>

          
        </header>

        {/* Content layout */}
        <main className="flex-1 px-4 md:px-8 py-6 flex flex-col lg:flex-row gap-6">
          {/* Left / center column */}
          <div className="flex-1 space-y-6">
            {/* View switcher */}
            <section>
              <div className="inline-flex rounded-full bg-slate-100 p-1 text-xs">
                <button
                  onClick={() => setView("projects-create")}
                  className={`px-4 py-1.5 rounded-full lg:text-sm lg:font-medium transition ${
                    view === "projects-create"
                      ? "bg-white shadow-sm text-slate-900"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Add project
                </button>
                <button
                  onClick={() => setView("projects-existing")}
                  className={`px-4 py-1.5 rounded-full lg:text-sm lg:font-medium transition ${
                    view === "projects-existing"
                      ? "bg-white shadow-sm text-slate-900"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Your projects
                </button>
                <button
                  onClick={() => setView("members")}
                  className={`px-4 py-1.5 rounded-full lg:text-sm lg:font-medium transition ${
                    view === "members"
                      ? "bg-white shadow-sm text-slate-900"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Team members
                </button>
              </div>
            </section>

            {/* Add project view */}
            {view === "projects-create" && (
              <section className="max-w-xl">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-1">
                    Create project
                  </h2>
                  <p className="text-xs  lg:text-sm text-slate-500 mb-4">
                    Add a new project that your team can work on.
                  </p>
                  <div className="space-y-3">
                    <input
                      placeholder="Project name"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <textarea
                      placeholder="Short description"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    <button
                      onClick={createProject}
                      className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
                    >
                      Create project
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* Existing projects view */}
            {view === "projects-existing" && (
              <section className="max-w-7xl">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base md:text-lg font-semibold text-slate-900">
                    Your Project
                  </h2>
                  <p className="text-xs text-slate-500">
                    {projects.length} active project{projects.length === 1 ? "" : "s"}
                  </p>
                </div>

                {projects.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No projects created yet. Switch to &quot;Add project&quot; to create one.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 lg:max-w-7xl gap-5">
                    {projects.map((project) => (
                      <div
                        key={project._id}
                        className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col gap-4"
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div>
                            <h3 className="text-sm lg:text-lg  font-semibold text-slate-900">
                              {project.name}
                            </h3>
                            {project.description && (
                              <p className="mt-1 text-xs text-slate-600 line-clamp-3">
                                {project.description}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setSelectedProject(project._id)}
                              className="rounded-lg bg-blue-50 px-3 py-1 text-[11px] lg:text-sm font-medium text-blue-700 hover:bg-blue-100"
                            >
                              Add member
                            </button>
                            <button
                              onClick={() => viewMembers(project._id)}
                              className="rounded-lg bg-slate-800 px-3 py-1 text-[11px] lg:text-sm font-medium text-white hover:bg-slate-900"
                            >
                              View
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => setProjectId(project._id)}
                          className="self-start rounded-full bg-red-50 px-3 py-1 text-[11px] font-medium text-red-700 hover:bg-red-100"
                        >
                          Assign issue
                        </button>

                        {selectedProject === project._id && (
                          <div className="border-t border-slate-100 pt-3 space-y-3">
                            <h4 className="text-[11px] lg:text-sm font-semibold text-slate-700">
                              Add member to this project
                            </h4>
                            <select
                              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              onChange={(e) => setMemberId(e.target.value)}
                            >
                              <option>Select member</option>
                              {allMembers.map((member) => (
                                <option key={member._id} value={member._id}>
                                  {member.name} ({member.role})
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={addMemberToProject}
                              className="rounded-lg bg-indigo-600 px-3 py-2 text-[11px] lg:text-sm font-semibold text-white hover:bg-indigo-700"
                            >
                              Add member to project
                            </button>
                          </div>
                        )}

                        {members.length > 0 && selectedProject === project._id && (
                          <div className="border-t border-slate-100 pt-3">
                            <h4 className="text-[11px] lg:text-[14px] font-semibold text-slate-700 mb-2">
                              Project members
                            </h4>
                            <div className="space-y-1">
                              {members.map((m) => (
                                <div
                                  key={m._id}
                                  className="text-[11px] lg:text-sm text-slate-700 flex items-center justify-between"
                                >
                                  <span>{m.name}</span>
                                  <span className="text-slate-400">{m.role}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {projectId === project._id && (
                          <div className="border-t border-slate-100 pt-3 space-y-3">
                            <h4 className="text-[11px] lg:text-sm font-semibold text-slate-700">
                              Create issue for this project
                            </h4>
                            <input
                              placeholder="Issue title"
                              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={issueTitle}
                              onChange={(e) => setIssueTitle(e.target.value)}
                            />
                            <textarea
                              placeholder="Issue description"
                              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              rows={3}
                              value={issueDesc}
                              onChange={(e) => setIssueDesc(e.target.value)}
                            />
                            <select
                              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={priority}
                              onChange={(e) => setPriority(e.target.value)}
                            >
                              <option value="low">Low priority</option>
                              <option value="medium">Medium priority</option>
                              <option value="high">High priority</option>
                            </select>
                            <button
                              onClick={createIssue}
                              className="rounded-lg bg-green-600 px-3 py-2 text-[11px] lg:text-sm font-semibold text-white hover:bg-green-700"
                            >
                              Create issue
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Team members view */}
            {view === "members" && (
              <section className="max-w-xl">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-1">
                    Create team member
                  </h2>
                  <p className="text-xs text-slate-500 mb-4 lg:text-sm">
                    Invite a new user to the system and assign them a role.
                  </p>

                  <div className="space-y-3">
                    <input
                      placeholder="Full name"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={memberName}
                      onChange={(e) => setMemberName(e.target.value)}
                    />

                    <input
                      placeholder="Email"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={memberEmail}
                      onChange={(e) => setMemberEmail(e.target.value)}
                    />

                    <input
                      placeholder="Temporary password"
                      type="password"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={memberPassword}
                      onChange={(e) => setMemberPassword(e.target.value)}
                    />

                    <select
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="developer">Developer</option>
                      <option value="reporter">Reporter</option>
                    </select>

                    <button
                      onClick={createMember}
                      className="w-full rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition"
                    >
                      Create member
                    </button>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Right column */}
          {/* <div className="w-full lg:max-w-sm space-y-5"> */}
            {/* Announcements */}
            

            {/* Trending / team snapshot */}
            {/* <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <h3 className="text-sm lg:text-lg font-semibold text-slate-900 mb-3">
                Team snapshot
              </h3>
              {trendingMembers.length === 0 ? (
                <p className="text-xs text-slate-500">
                  No members loaded yet. New members you create will appear here.
                </p>
              ) : (
                <div className="space-y-3 text-xs text-slate-700">
                  {trendingMembers.map((m) => (
                    <div
                      key={m._id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="lg:font-semibold lg:text-sm text-slate-900">
                          {m.name}
                        </p>
                        <p className="lg:text-sm text-slate-500 capitalize">
                          {m.role}
                        </p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] text-slate-600">
                        Member
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section> */}
          {/* </div> */}
        </main>
      </div>
    </div>
  );
}