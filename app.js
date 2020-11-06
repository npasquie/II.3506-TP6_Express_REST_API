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
    // Retrieve gender, age and name
    const {gender, age, name} = req.query

    const createdElements = getClinic().create(gender, name, parseInt(age))

    res.status(200).set({ 'Content-Type': 'application/json' }).json(createdElements)
})


app.post('/remove/:stackId', (req, res) => {

    let findStack = getClinic().removeStackFromEnvelope(req.params.stackId)

    if (findStack === false) {
        res.status(400)
    }
    else {
        res.status(204)
    }
    res.end()
})

app.post('/kill/:envelopeId', (req, res) => {
    
    let findEnvelope = false
    for (let i = 0; i < getClinic().envelopes.length; i++) {
        if (getClinic().envelopes[i].id === parseInt(req.params.envelopeId)) {
            getClinic().removeStackFromEnvelope(getClinic().envelopes[i].idStack)
            getClinic().killEnvelope(req.params.envelopeId)
            findEnvelope = true
        }
    }

    if (findEnvelope === false) {
        res.status(400)
    }
    else {
        res.status(204)
    }
    res.end()
})

export default app
