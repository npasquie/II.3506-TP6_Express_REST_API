import request from 'supertest'
import app from '../src/controller/app'

import * as clinicDependency from '../src/weiClinic'

const returnValue400 = {
    status: 400,
    message: `Envelope 1 not found`
}
const returnValue204 = {
    status: 204,
    message: {}
}

const sendRequest = (statusCode, done) => {
    let returnValue
    statusCode === 204 ? returnValue = returnValue204 : returnValue = returnValue400

    const killEnvelope = jest.fn().mockReturnValue(returnValue)

    clinicDependency.getClinic.mockReturnValue({
        killEnvelope: killEnvelope
    })

    request(app)
        .post('/kill/1')
        .expect(returnValue.status)
        .expect(response => {
            expect(response.body).toEqual(returnValue.message)
            expect(killEnvelope).toHaveBeenCalledTimes(1)
            expect(killEnvelope).toHaveBeenCalledWith("1")
        })
        .end(done)
}

beforeEach(() => {
    clinicDependency.getClinic = jest.fn().mockReturnValue({
        killEnvelope: jest.fn(),
        stacks: [],
        envelopes: []
    })
})

describe('Kill action', () => {
    it('When the envelope cannot be found', (done) => {
        sendRequest(400, done)
    })
    
    it('When we can kill', done => {
        clinicDependency.getClinic = jest.fn().mockReturnValue({
            envelopes: [{id: 1, gender: 'M', age: 75, idStack: null}]
        })

        sendRequest(204, done)
    })
})
