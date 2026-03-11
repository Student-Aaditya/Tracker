import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminDashboard() {

const token = localStorage.getItem("token");

const [view,setView] = useState("projects");
const [projects,setProjects] = useState([]);

const [name,setName] = useState("");
const [description,setDescription] = useState("");

const [memberName,setMemberName] = useState("");
const [memberEmail,setMemberEmail] = useState("");
const [memberPassword,setMemberPassword] = useState("");
const [role,setRole] = useState("developer");

const [issueTitle,setIssueTitle] = useState("");
const [issueDesc,setIssueDesc] = useState("");
const [priority,setPriority] = useState("medium");
const [projectId,setProjectId] = useState("");

const [comment,setComment] = useState("");

//state for members modal
const [members,setMembers] = useState([]);
const [selectedProject,setSelectedProject] = useState(null);
const [memberId,setMemberId] = useState("");
const [allMembers,setAllMembers] = useState([]);

useEffect(()=>{
fetchProjects();
},[]);


const fetchProjects = async ()=>{
try{
const res = await axios.get(
"http://localhost:8080/api/admin/projects",
{headers:{Authorization:token}}
);
setProjects(res.data.projects);
}catch(err){
console.log(err);
}
};


const createProject = async()=>{
try{
await axios.post(
"http://localhost:8080/api/admin/projects",
{name,description},
{headers:{Authorization:token}}
);
alert("Project Created");
fetchProjects();
}catch(err){
alert("Error creating project");
}
};


const createMember = async()=>{
try{
await axios.post(
"http://localhost:8080/api/admin/members",
{
name:memberName,
email:memberEmail,
password:memberPassword,
role
},
{headers:{Authorization:token}}
);
alert("Member Created");
}catch(err){
alert("Error creating member");
}
};


const createIssue = async()=>{
try{
await axios.post(
"http://localhost:8080/api/admin/issues",
{
title:issueTitle,
description:issueDesc,
priority,
project:projectId
},
{headers:{Authorization:token}}
);
alert("Issue Created");
}catch(err){
alert("Error creating issue");
}
};

//fetching projects members
const viewMembers = async (projectId) => {
try{

const res = await axios.get(
`http://localhost:8080/api/admin/projects/${projectId}`,
{headers:{Authorization:token}}
);

setMembers(res.data.members);
setSelectedProject(projectId);

}catch(err){
console.log(err);
}
};

//Adding members to assign projects
const addMemberToProject = async () => {

try{

await axios.post(
`http://localhost:8080/api/admin/projects/${selectedProject}/members`,
{userId:memberId},
{headers:{Authorization:token}}
);

alert("Member added to project");

}catch(err){
alert("Error adding member");
}

};
//fetching members
const fetchMembers = async () => {
try{

const res = await axios.get(
"http://localhost:8080/api/admin/members",
{headers:{Authorization:token}}
);

setAllMembers(res.data.members);

}catch(err){
console.log(err);
}
};

useEffect(()=>{
fetchProjects();
fetchMembers();
},[]);


return(

<div className="min-h-screen bg-gray-100 p-10">

<h1 className="text-3xl font-bold mb-8">
Administrator Dashboard
</h1>


<div className="flex gap-4 mb-8">

<button
onClick={()=>setView("projects")}
className="bg-blue-500 text-white px-4 py-2 rounded"
>
Add Project
</button>

<button
onClick={()=>setView("members")}
className="bg-purple-500 text-white px-4 py-2 rounded"
>
Add Project Member
</button>

</div>



{view==="projects" && (

<div className="bg-white p-6 rounded-xl shadow mb-8">

<h2 className="text-xl font-semibold mb-4">
Create Project
</h2>

<input
placeholder="Project Name"
className="border p-2 w-full mb-3 rounded"
onChange={(e)=>setName(e.target.value)}
/>

<textarea
placeholder="Description"
className="border p-2 w-full mb-3 rounded"
onChange={(e)=>setDescription(e.target.value)}
/>

<button
onClick={createProject}
className="bg-green-500 text-white px-4 py-2 rounded"
>
Create Project
</button>

</div>

)}



{view==="members" && (

<div className="bg-white p-6 rounded-xl shadow mb-8">

<h2 className="text-xl font-semibold mb-4">
Create Project Member
</h2>

<input
placeholder="Name"
className="border p-2 w-full mb-3 rounded"
onChange={(e)=>setMemberName(e.target.value)}
/>

<input
placeholder="Email"
className="border p-2 w-full mb-3 rounded"
onChange={(e)=>setMemberEmail(e.target.value)}
/>

<input
placeholder="Password"
type="password"
className="border p-2 w-full mb-3 rounded"
onChange={(e)=>setMemberPassword(e.target.value)}
/>

<select
className="border p-2 w-full mb-3 rounded"
onChange={(e)=>setRole(e.target.value)}
>
<option value="developer">Developer</option>
<option value="reporter">Reporter</option>
</select>

<button
onClick={createMember}
className="bg-purple-500 text-white px-4 py-2 rounded"
>
Create Member
</button>

</div>

)}



{/* PROJECT LIST */}

<div className="grid grid-cols-3 gap-6">

{projects.map((project)=>(
<div
key={project._id}
className="bg-white p-6 rounded-xl shadow"
>

<div className="flex justify-between items-center mb-2">

<h3 className="text-lg font-bold">
{project.name}
</h3>

<div className="flex gap-2">

<button
onClick={()=>setSelectedProject(project._id)}
className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
>
Add Member
</button>

<button
onClick={()=>viewMembers(project._id)}
className="bg-gray-700 text-white px-2 py-1 rounded text-sm"
>
View
</button>

</div>

</div>

<p className="text-gray-600 mb-4">
{project.description}
</p>


<button
onClick={()=>setProjectId(project._id)}
className="bg-red-500 text-white px-3 py-1 rounded mb-4"
>
Assign Issue
</button>
{selectedProject===project._id && (

<div className="mb-4">
<select
className="border p-2 w-full mb-2 rounded"
onChange={(e)=>setMemberId(e.target.value)}
>

<option>Select Member</option>

{allMembers.map((member)=>(
<option key={member._id} value={member._id}>
{member.name} ({member.role})
</option>
))}

</select>

<button
onClick={addMemberToProject}
className="bg-indigo-500 text-white px-3 py-1 rounded"
>
Add Member To Project
</button>

</div>

)}

{members.length>0 && selectedProject===project._id && (

<div className="mb-4">

<h4 className="font-semibold mb-2">
Project Members
</h4>

{members.map((m)=>(
<div key={m._id} className="text-sm text-gray-700">
{m.name} ({m.role})
</div>
))}

</div>

)}

{projectId===project._id && (

<div className="border-t pt-4">

<h4 className="font-semibold mb-2">
Create Issue
</h4>

<input
placeholder="Issue Title"
className="border p-2 w-full mb-2 rounded"
onChange={(e)=>setIssueTitle(e.target.value)}
/>

<textarea
placeholder="Issue Description"
className="border p-2 w-full mb-2 rounded"
onChange={(e)=>setIssueDesc(e.target.value)}
/>

<select
className="border p-2 w-full mb-2 rounded"
onChange={(e)=>setPriority(e.target.value)}
>
<option value="low">Low</option>
<option value="medium">Medium</option>
<option value="high">High</option>
</select>

<button
onClick={createIssue}
className="bg-green-500 text-white px-3 py-1 rounded"
>
Create Issue
</button>

</div>

)}

</div>

))}

</div>

</div>

);

}