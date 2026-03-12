const Issue = require("../Modal/issue.model.js");
const Project = require("../Modal/project.model.js");

const getMyProjects = async (req, res) => {

  try {

    const projects = await Project.find({
      members: req.user.id
    })
    .populate("createdBy", "name email");

    const result = [];
    for (let project of projects) {

      const issues = await Issue.find({
        project: project._id,
        assignedTo: req.user.id,
      })
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email title");

      result.push({
        projectId: project._id,
        projectName: project.name,
        description: project.description,
        issues:issues
      });

    }

    res.status(200).json({
      message: "Projects fetched successfully",
      projects: result
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }

};

//getUserProjectissue
const getUserProjectIssues = async (req, res) => {
  try {

    const userId = req.user.id;
    // Step 1: find projects where user is member
    const projects = await Project.find({
      members: userId
    });

    const projectIds = projects.map((project) => project._id);

    // Step 2: find issues using projectIds; populate project so frontend can show project name
    const issues = await Issue.find({
      project: { $in: projectIds }
    })
    .select("title description project status comments")
    .populate("project", "name");

    res.status(200).json({
      projects: projectIds,
      issues
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }
};

const getAssignedIssues = async (req, res) => {

  try {

    const issues = await Issue.find({
      assignedTo: req.user.id
    })
    .populate("project", "name description")
    .populate("createdBy", "name email");

    res.status(200).json({
      issues
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }

};


//get issues assign by project
const getIssuesByProject = async (req, res) => {
  try {

    const { projectId } = req.params;

    const issues = await Issue.find({
      project: projectId,
      assignedTo: req.user.id   
    })
    .populate("project", "name description")
    .populate("createdBy", "name email")
    .populate("assignedTo", "name email");

    res.status(200).json({
      message: "Issues fetched successfully",
      issues
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }
};

const updateIssueStatus = async (req, res) => {

  try {

    const { issueId } = req.params;
    const { status } = req.body;

    const issue = await Issue.findById(issueId);

    if (!issue) {
      return res.status(404).json({
        message: "Issue not found"
      });
    }

    issue.status = status;

    await issue.save();

    res.status(200).json({
      message: "Issue status updated",
      issue
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }

};


const addComment = async (req, res) => {

  try {

    const { issueId } = req.params;
    const { comment } = req.body;

    const issue = await Issue.findById(issueId);

    if (!issue) {
      return res.status(404).json({
        message: "Issue not found"
      });
    }

    issue.comments.push({
      text: comment,
      user: req.user.id
    });

    await issue.save();

    res.status(200).json({
      message: "Comment added"
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }

};


const getAssignedTasks = async (req, res) => {

  try {

    const issues = await Issue.find({
      assignedTo: req.user.id
    })
    .populate("project", "name description")
    .populate("createdBy", "name email")
    .populate("assignedTo", "name email");

    if (!issues || issues.length === 0) {
      return res.status(200).json({
        message: "No assigned tasks",
        issues: []
      });
    }

    res.status(200).json({
      message: "Assigned tasks fetched successfully",
      issues
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }

};



module.exports = {
  getMyProjects,
  getAssignedIssues,
  updateIssueStatus,
  addComment,
  getAssignedTasks,
  getIssuesByProject,
  getUserProjectIssues
};