const express = require('express')
const actionsDb = require('../data/helpers/actionModel')
const projectsDb = require('../data/helpers/projectModel')

const router = express.Router()

// Schema
// {
//   project_id: 1,
//   description: 'Design and Build API Endpoints',
//   notes: 'This is where the magic happens!',
// },

//get all actions
router.get('/', async (req, res) => { 
  try {
    const actions = await actionsDb.get()
    res.status(200).json(actions) 
  } catch {
    res.status(500).json({ message: "Error retrieving actions from the database."})
  }
})

//get a specific action
router.get('/:id', validateActionId, async (req, res) => {  
  try {
    const actions = await actionsDb.get(req.params.id)
    res.status(200).json(actions) 
  } catch {
    res.status(500).json({ message: "Error retrieving actions from the database."})
  }
})

//add an action
router.post('/', validateAction, validateProjectId, async (req, res) => {
  try {
    const addedAction = await actionsDb.insert(req.body)
    res.status(201).json(addedAction)
  } catch {
    res.status(500).json({ message: "The action could not be added to the database."})
  }
})


//update an action
router.put('/:id', validateAction, validateActionId, validateProjectId, async (req, res) => {
  try {
    const updatedAction = await actionsDb.update(req.params.id, req.body)
    res.status(200).json(updatedAction)
  } catch {
    res.status(500).json({ message: "Could not update action with specified ID."})
  }
})


//delete a project
router.delete('/:id', )


//middleware 

async function validateActionId(req, res, next){
  const action = await actionsDb.get(req.params.id)
  if (!action){
    res.status(404).json({ message: "The action with the specified ID does not exist."})
  } else {
    next()
  }
}

async function validateProjectId(req, res, next){
  const project = await projectsDb.get(req.body.project_id)
  if (!project){
    res.status(404).json({ message: "The project ID does not refer to an existing project."})
  } else {
    next()
  }
}

async function validateAction(req, res, next){
  if (!req.body){
    res.status(404).json({ message: "Please provide action to insert."})
  } else if (!req.body.project_id || !req.body.description || !req.body.notes) {
    res.status(400).json({message: "Please provide project ID, description, and notes in the request body."})
  } else {
    next()
  }
}


module.exports = router