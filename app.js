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


app.post('/remove/:stackId', (request, response) => {
    
    let findStack = false
    for (let i = 0; i < getClinic().stacks.length; i++) {
        if (getClinic().stacks[i].id == request.params.stackId) {
            for (let j = 0; j < getClinic().envelopes.length; j++) {
                if (getClinic().envelopes[j].idStack === getClinic().stacks[i].id) {
                    getClinic().envelopes[j].idStack = null
                    getClinic().stacks[i].idEnvelope = null
		            findStack = true
                } 
            }            
        }
    }
    if (findStack === false) {
        response.status(400)
    }
    else {
        response.status(204)
    }
    response.end()
})

export default app