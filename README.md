Issue Tracker (MERN Stack Project)
Project Overview

This is a full-stack Issue Tracking System built using the MERN stack (MongoDB, Express, React, Node.js).

The application helps teams manage projects, track issues, and collaborate easily.

Different users have different responsibilities in the system.

The project is divided into two main parts:

Frontend – built with React, Vite, and Tailwind CSS

Backend – built with Node.js, Express, and MongoDB

Technologies Used

Frontend:-

React

Vite

Tailwind CSS

Axios

Backend :-

Node.js

Express.js

MongoDB

Mongoose

JWT Authentication

Bcrypt


User Roles

The system supports three types of users.

Administrator

Administrator manages the overall system.

Admin can:

Create projects

Add members to projects

Assign issues to developers

Manage project workflow

Developer

Developers work on issues assigned to them.

Developer can:

View assigned projects

View assigned issues

Update issue status (Open, In Progress, Resolved, Closed)

Add comments to discussions

Reporter

Reporters create issues or feature requests.

Reporter can:

Create issues

Submit feature requests

Track the progress of their issues

Install Dependencies:-

Frontend :-

cd Frontend
npm install

Backend:-
cd Tracking_Portal
npm install

Start Backend Server:-

nodemon app.js

Backend run on server :- hhtp://localhost:8080/


Start Frontend

Open another terminal and run:
cd Frontend
npm run dev

Frontend run on server :- http://localhost:5173/


Application Workflow

User registers a new account.

User logs into the system.

If the role is pending, the user chooses a role.

Based on the selected role, the user is redirected to their dashboard.

Main Features

User Authentication (JWT)

Role-based authorization

Project management

Issue tracking system

Issue status updates

Comment discussions

Feature request submission