const express = require("express");
const router = express.Router();

const adminController = require("../Controller/admin.controller.js");
const auth = require("../Middleware/auth.middleware.js");
const authorizeRoles = require("../Middleware/role.middleware.js");

// Create project
router.post("/projects",auth,authorizeRoles("administrator"),adminController.createProject);

// Get all projects
router.get("/projects",auth,authorizeRoles("administrator"),adminController.getProjects);

// Create new member
router.post("/members",auth,authorizeRoles("administrator"),adminController.createMember);

// Add member to project
router.post("/projects/:projectId/members",auth,authorizeRoles("administrator"),adminController.addMemberToProject);

// View members of project
router.get("/projects/:projectId",auth,authorizeRoles("administrator"),adminController.getProjectMembers);

//get all members
router.get("/members",auth,authorizeRoles("administrator"),adminController.getAllMembers);

// Create issue
router.post("/issues",auth,authorizeRoles("administrator"),adminController.createIssue);

// Assign issue
router.patch("/issues/:issueId/assign",auth,authorizeRoles("administrator"),adminController.assignIssue);

// Get issues of a project
router.get("/projects/:projectId/issues",auth,authorizeRoles("administrator"),adminController.getProjectIssues);

module.exports = router;