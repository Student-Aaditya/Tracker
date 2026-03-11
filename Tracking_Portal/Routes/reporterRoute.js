const express = require("express");
const router = express.Router();

const reporterController = require("../Controller/reporter.controller.js");
const authMiddleware = require("../Middleware/auth.middleware.js");


// Reporter projects (projects where this reporter is a member)
router.get("/my-projects", authMiddleware, reporterController.myProjects);

// Reporter feature requests
router.post("/feature-request", authMiddleware, reporterController.createFeatureRequest);
router.get("/feature-requests", authMiddleware, reporterController.myFeatureRequests);
router.post("/feature-request/:requestId/comment", authMiddleware, reporterController.addFeatureRequestComment);

// Reporter issues
router.post("/issue", authMiddleware, reporterController.createIssue);
router.get("/my-issues", authMiddleware, reporterController.myIssues);
router.get("/issue/:issueId", authMiddleware, reporterController.getIssueDetails);
router.post("/issue/:issueId/comment", authMiddleware, reporterController.addComment);

module.exports = router;