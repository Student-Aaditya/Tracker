const Issue = require("../Modal/issue.model.js");
const Project = require("../Modal/project.model.js");
const Comment = require("../Modal/comment.model.js");
const FeatureRequest = require("../Modal/featureRequest.model.js");

const reporterController = {

// Create a new issue reported by the current user
createIssue: async (req, res) => {

    try {

        const { title, description, project, priority } = req.body;

        const issue = new Issue({
            title,
            description,
            project,
            priority,
            createdBy: req.user.id
        });

        await issue.save();

        res.status(201).json({
            message: "Issue reported successfully",
            issue
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" ,data:error.message});
    }

},


// Create a new feature request for admin
createFeatureRequest: async (req, res) => {

    try {

        const { title, description } = req.body;

        const request = new FeatureRequest({
            title,
            description,
            createdBy: req.user.id
        });

        await request.save();

        res.status(201).json({
            message: "Feature request submitted successfully",
            request
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", data: error.message });
    }

},


// Get projects where this reporter is a member
myProjects: async (req, res) => {

    try {

        const projects = await Project.find({
            members: req.user.id
        })
        .populate("createdBy", "name email");

        res.status(200).json({
            message: "Projects fetched successfully",
            projects
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", data: error.message });
    }

},


// Get all feature requests created by this reporter
myFeatureRequests: async (req, res) => {

    try {

        const requests = await FeatureRequest.find({
            createdBy: req.user.id
        })
        .populate("createdBy", "name email")
        .populate("comments.user", "name email");

        res.status(200).json({
            requests
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", data: error.message });
    }

},


// Track issues reported by this reporter
myIssues: async (req, res) => {

    try {

        const issues = await Issue.find({
            createdBy: req.user.id
        })
        .populate("project","name")
        .populate("assignedTo","name email");

        res.status(200).json({
            issues
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }

},


// Get single issue with comments
getIssueDetails: async (req, res) => {

    try {

        const { issueId } = req.params;

        const issue = await Issue.findById(issueId)
        .populate("createdBy","name email")
        .populate("assignedTo","name email");

        const comments = await Comment.find({ issue: issueId })
        .populate("user","name");

        res.status(200).json({
            issue,
            comments
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }

},


// Add comment to issue
addComment: async (req, res) => {

    try {

        const { issueId } = req.params;
        const { message } = req.body;

        const comment = new Comment({
            issue: issueId,
            user: req.user.id,
            message
        });

        await comment.save();

        res.status(201).json({
            message: "Comment added",
            comment
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }

},


// Add comment to a feature request
addFeatureRequestComment: async (req, res) => {

    try {

        const { requestId } = req.params;
        const { message } = req.body;

        const request = await FeatureRequest.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: "Feature request not found" });
        }

        request.comments.push({
            user: req.user.id,
            message
        });

        await request.save();

        res.status(201).json({
            message: "Comment added to feature request"
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", data: error.message });
    }

}

};

module.exports = reporterController;