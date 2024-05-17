const variablesRouter = require('express').Router()

const variables = require('../variables.js')
/*
const iterateVariableObject = (variablesObject) => {
  const response = Object.entries(variablesObject).map(([key, value]) => {
    const newObject = {}
    newObject[key] = value
    return newObject
  })
  return response
} */

variablesRouter.get('/genders', (req, res) => {
  const { genders } = variables

  res.json(genders)
})

variablesRouter.get('/platforms', (req, res) => {
  const { platforms } = variables

  res.json(platforms)
})

variablesRouter.get('/gameStates', (req, res) => {
  const { gameStates } = variables

  res.json(gameStates)
})

module.exports = variablesRouter
