const express = require('express')
const projectDb = require('../data/helpers/projectModel')

const router = express.Router()

// Schema
// {
//   name: 'Complete Node.js and Express Challenge',
//   description:
//     'Build and Awesome API Using Node.js and Express to Manage Projects and Actions GTD Style!',
// },

//get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await projectDb.get()
    res.status(200).json(projects)
  } catch {
    res.status(500).json({ message: "Error retrieving projects from the database. "})
  }
})

//get specific project
router.get('/:id', validateProjectId, async (req, res) => {
  try {
    const project = await projectDb.get(req.params.id)
    res.status(200).json(project)
  } catch {
    res.status(500).json({ message: "Error retrieving project with specified ID from the database. "})
  }
})

//get all actions for a specific project id
router.get('/:id/actions', validateProjectId, async (req, res) => {
  try {
    const project = await projectDb.getProjectActions(req.params.id)
    res.status(200).json(project)
  } catch {
    res.status(500).json({ message: "Error retrieving project actions with specified ID from the database. "})
  }
})

//add a project
router.post('/', validateProject, async (req, res) => {
  try {
    const addedProject = await projectDb.insert(req.body)
    res.status(201).json(addedProject)
  } catch {
    res.status(500).json({ message: "Could not add project to database."})
  }
})

//update a project
router.put('/:id', validateProjectId, validateProject, async (req, res) => {
  try {
    const updatedProject = await projectDb.update(req.params.id, req.body)
    res.status(200).json(updatedProject)
  } catch {
    res.status(500).json({ message: "Could not update project with the specified ID."})
  }
})

//delete a project
router.delete('/:id', validateProjectId, async (req, res) => {
  try {
    const count = await projectDb.remove(req.params.id)
    if (count > 0) {
      const updatedProjects = await projectDb.get()
      res.status(200).json(updatedProjects)
    }
  } catch {
    res.status(500).json({ message: "Could not remove project with specified ID."})
  }
})



//middleware 

async function validateProjectId(req, res, next){
  const project = await projectDb.get(req.params.id)
  if (!project) {
    res.status(404).json({ message: "Invalid project ID."})
  } else {
    next()
  }
}

async function validateProject(req, res, next){
  if (!req.body ) {
    res.status(400).json({ message: "Please include a valid project."})
  } else if (!req.body.name || !req.body.description) {
    res.status(400).json({ message: "Please include a name and description."})
  } else {
    next()
  }
}


module.exports = router


