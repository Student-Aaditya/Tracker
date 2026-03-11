const Project = require("../Modal/project.model.js");
const User = require("../Modal/register.modal.js");
const Issue = require("../Modal/issue.model.js");
const bcrypt = require("bcrypt");

const adminController = {

  createProject: async (req, res) => {
    try {
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Project name required" });
      }

      const project = new Project({
        name,
        description,
        createdBy: req.user.id,
      });

      await project.save();

      res.status(201).json({
        message: "Project created successfully",
        project,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },


  getProjects: async (req, res) => {
    try {
      const projects = await Project.find()
        .populate("members", "name email role")
        .populate("createdBy", "name email");

      res.status(200).json({
        projects,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },


  createMember: async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

      const exist = await User.findOne({ email });

      if (exist) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const member = new User({
        name,
        email,
        password: hashedPassword,
        role,
      });

      await member.save();

      res.status(201).json({
        message: "Member created successfully",
        member,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  
  addMemberToProject: async (req, res) => {
    try {
      const { projectId } = req.params;
      const { userId } = req.body;

      const project = await Project.findById(projectId);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      if (!project.members.includes(userId)) {
        project.members.push(userId);
      }

      await project.save();

      res.status(200).json({
        message: "Member added to project",
        project,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getProjectMembers: async (req, res) => {

  try {

    const { projectId } = req.params;

    const project = await Project.findById(projectId)
      .populate("members", "name email role");

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    res.status(200).json({
      projectId: project._id,
      projectName: project.name,
      members: project.members
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }

},

//get all members
getAllMembers: async (req, res) => {
  try {

    const members = await User.find({
      role: { $in: ["developer", "reporter"] }
    }).select("name email role");

    res.status(200).json({
      members
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
},

  // Create Issue
  createIssue: async (req, res) => {
    try {
      const { title, description, project, priority } = req.body;

      if (!title || !description || !project) {
        return res.status(400).json({
          message: "Title, description and project are required",
        });
      }

      const issue = new Issue({
        title,
        description,
        project,
        priority,
        createdBy: req.user.id,
      });

      await issue.save();

      res.status(201).json({
        message: "Issue created successfully",
        issue,
      });
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  },

  
  assignIssue: async (req, res) => {
    try {
      const { issueId } = req.params;
      const { developerId } = req.body;

      const issue = await Issue.findById(issueId);

      if (!issue) {
        return res.status(404).json({ message: "Issue not found" });
      }

      issue.assignedTo = developerId;

      await issue.save();

      res.status(200).json({
        message: "Issue assigned successfully",
        issue,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

 
  getProjectIssues: async (req, res) => {
    try {
      const { projectId } = req.params;

      const issues = await Issue.find({ project: projectId })
        .populate("assignedTo", "name email")
        .populate("createdBy", "name");

      res.status(200).json({
        issues,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = adminController;
