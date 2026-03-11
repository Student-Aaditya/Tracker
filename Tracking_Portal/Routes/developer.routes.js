const express = require("express");
const router = express.Router();

const developerController = require("../Controller/developer.controller.js");
const auth = require("../Middleware/auth.middleware.js");
const authorizeRoles = require("../Middleware/role.middleware.js");


// Get developer projects
router.get("/projects",auth,authorizeRoles("developer"),developerController.getMyProjects);
// Get issues by project
router.get("/projects/:projectId/issues",auth,authorizeRoles("developer"),developerController.getIssuesByProject);

//get assign issues
router.get("/issues",auth,authorizeRoles("developer"),developerController.getAssignedIssues);

// assigned tasks
router.get("/tasks",auth,authorizeRoles("developer"),developerController.getAssignedTasks);

// Update issue status
router.patch("/issues/:issueId/status",auth,authorizeRoles("developer"),developerController.updateIssueStatus);

// Add comment
router.post("/issues/:issueId/comment",auth,authorizeRoles("developer"),developerController.addComment);


module.exports = router;