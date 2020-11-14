import express from 'express'
import bodyParser from 'body-parser'

import {getClinic} from '../weiClinic'

const app = express()

app.use(bodyParser.json())
app.use(function (_req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

app.get('/stacks', (req, res) => {
    const stacks = getClinic().stacks
    res.status(200).set({'Content-Type': 'application/json'}).json(stacks)
})

app.get('/envelopes', (req, res) => {
    const envelopes = getClinic().envelopes
    res.status(200).set({'Content-Type': 'application/json'}).json(envelopes)
})

app.get('/digitize', async (req, res) => {
    const {gender, age, name} = req.query
    const result = await getClinic().create(gender, name, parseInt(age))
    res.status(result.status).set({'Content-Type': 'application/json'}).json(result.message)
})

app.post('/remove/:stackId', async (req, res) => {
    const result = await getClinic().removeStackFromEnvelope(req.params.stackId)
    res.status(result.status).set({'Content-Type': 'application/json'}).json(result.message)
    res.end()
})

app.put('/implant/:stackId/:envelopeId?', async (req, res) => {
    const result = await getClinic().assignStackToEnvelope(req.params.stackId, req.params.envelopeId)
    res.status(result.status).set({'Content-Type': 'application/json'}).json(result.message)
    res.end()
})

app.post('/kill/:envelopeId', async (req, res) => {
    const result = await getClinic().killEnvelope(req.params.envelopeId)
    res.status(result.status).set({'Content-Type': 'application/json'}).json(result.message)
    res.end()
})

app.delete('/truedeath/:stackId', async (req, res) => {
    const result = await getClinic().destroyStack(req.params.stackId)
    res.status(result.status).set({'Content-Type': 'application/json'}).json(result.message)
    res.end()
})

export default app
