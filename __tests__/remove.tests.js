import request from 'supertest'
import app from '../src/controller/app'

import * as clinicDependency from '../src/weiClinic'


const returnValue400 = {
    status: 400,
    message: `Stack 1 or corresponding envelope not found`
}
const returnValue204 = {
    status: 204,
    message: {}
}

const sendRequest = (statusCode, done) => {
    let returnValue
    statusCode === 204 ? returnValue = returnValue204 : returnValue = returnValue400

    const removeStackFromEnvelope = jest.fn().mockReturnValue(returnValue)

    clinicDependency.getClinic.mockReturnValue({
        removeStackFromEnvelope: removeStackFromEnvelope
    })

    request(app)
        .post('/remove/1')
        .expect(returnValue.status)
        .expect(response => {
            expect(response.body).toEqual(returnValue.message)
            expect(removeStackFromEnvelope).toHaveBeenCalledTimes(1)
            expect(removeStackFromEnvelope).toHaveBeenCalledWith("1")
        })
        .end(done)
}

beforeEach(() => {
    clinicDependency.getClinic = jest.fn().mockReturnValue({
        removeStackFromEnvelope: jest.fn(),
        stacks: [],
        envelopes: []
    })
})

describe('Remove action', () => {
    it('When the stack cannot be found', done => {
        sendRequest(400, done)
    })

    it('When there is no corresponding envelope', done => {
        clinicDependency.getClinic = jest.fn().mockReturnValue({
            stacks: [{id: 1, realGender: 'M', name: 'Bob', age: 75, idEnvelope: null}]
        })

        sendRequest(400, done)
    })

    it('When the envelope cannot be found', done => {
        clinicDependency.getClinic = jest.fn().mockReturnValue({
            stacks: [{id: 1, realGender: 'M', name: 'Bob', age: 75, idEnvelope: 1}]
        })

        sendRequest(400, done)
    })

    it('When we can remove', done => {
        clinicDependency.getClinic = jest.fn().mockReturnValue({
            stacks: [{id: 1, realGender: 'M', name: 'Bob', age: 75, idEnvelope: 1}],
            envelopes: [{id: 1, gender: 'M', age: 75, idStack: 1}]
        })

        sendRequest(204, done)
    })
})
