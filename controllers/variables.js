const variablesRouter = require('express').Router()

const variables = require('../variables.js')

const iterateVariableObject = (variablesObject) => {
  const response = Object.entries(variablesObject).map(([key, value]) => {
    const newObject = {}
    newObject[key] = value
    return newObject
  })
  return response
}

variablesRouter.get('/genders', (req, res) => {
  const { genders } = variables

  res.json(iterateVariableObject(genders))
})

variablesRouter.get('/plataforms', (req, res) => {
  const { plataforms } = variables

  res.json(iterateVariableObject(plataforms))
})

variablesRouter.get('/gameStates', (req, res) => {
  const { gameStates } = variables

  res.json(iterateVariableObject(gameStates))
})

module.exports = variablesRouter
