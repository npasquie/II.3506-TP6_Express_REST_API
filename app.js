import express from 'express'
import bodyParser from 'body-parser'

import {getClinic} from './weiClinic'

const app = express()

app.use(bodyParser.json())
app.use(function (_req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

app.get('/digitize', (req, res) => {
    const {gender, age, name} = req.query
    const createdElements = getClinic().create(gender, name, parseInt(age))
    res.status(200).set({'Content-Type': 'application/json'}).json(createdElements)
})

app.post('/remove/:stackId', (req, res) => {
    const findStack = getClinic().removeStackFromEnvelope(req.params.stackId)
    findStack ? res.status(204) : res.status(400)
    res.end()
})

app.put('/implant/:stackId/:envelopeId', (req, res) => {
    const stackId = req.params.stackId
    const envelopeId = req.params.envelopeId
    let returnStatus = getClinic().assignStackToEnvelope(stackId, envelopeId)

    switch (returnStatus) {
        case 0:
            res.status(400)
            break
        case 1:
            res.status(404)
            break
        case 2:
            res.status(204)
            break
    }
    res.end()
})

app.post('/kill/:envelopeId', (req, res) => {
    let findEnvelope = getClinic().killEnvelope(req.params.envelopeId)
    findEnvelope ? res.status(204) : res.status(400)
    res.end()
})

app.delete('/truedeath/:stackId', (req, res) => {
    const stackId = req.params.stackId
    let done = getClinic().destroyStack(stackId)

    if (done === false) {
        res.status(400)
    } else {
        res.status(204)
    }
    res.end()
})

export default app
