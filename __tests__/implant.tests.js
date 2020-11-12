import request from 'supertest'
import app from '../src/controller/app'

import * as clinicDependency from '../src/weiClinic'

const returnValue400 = {
    status: 400,
    message: `Stack 1 or envelope 1 not found`
}
const returnValue404 = {
    status: 404,
    message: `No backup envelopes available`
}
const returnValue204 = {
    status: 204,
    message: {}
}

const sendRequest = (statusCode, useBackup, done) => {
    let returnValue
    switch (statusCode) {
        case 204:
            returnValue = returnValue204
            break
        case 400:
            returnValue = returnValue400
            break
        case 404:
            returnValue = returnValue404
            break
    }
    let url, secondParam
    if(useBackup) {
        url = '/implant/1'
        secondParam = undefined
    } else {
        url = '/implant/1/1'
        secondParam = "1"
    }

    const assignStackToEnvelope = jest.fn().mockReturnValue(returnValue)

    clinicDependency.getClinic.mockReturnValue({
        assignStackToEnvelope
    })

    request(app)
        .put(url)
        .expect(returnValue.status)
        .expect(response => {
            expect(response.body).toEqual(returnValue.message)
            expect(assignStackToEnvelope).toHaveBeenCalledTimes(1)
            expect(assignStackToEnvelope).toHaveBeenCalledWith("1", secondParam)
        })
        .end(done)
}

beforeEach(() => {
    clinicDependency.getClinic = jest.fn().mockReturnValue({
        assignStackToEnvelope: jest.fn(),
        stacks: [],
        envelopes: []
    })
})

describe('Implant action', () => {
    it('When the stack cannot be found', done => {
        sendRequest(400, false, done)
    })

    it('When the stack is already assigned', done => {
        clinicDependency.getClinic = jest.fn().mockReturnValue({
            stacks: [{id: 1, realGender: 'M', name: 'Bob', age: 75, idEnvelope: 1}]
        })

        sendRequest(400, false, done)
    })

    it('When the envelope cannot be found', done => {
        clinicDependency.getClinic = jest.fn().mockReturnValue({
            stacks: [{id: 1, realGender: 'M', name: 'Bob', age: 75, idEnvelope: null}]
        })

        sendRequest(400, false, done)
    })

    it('When the envelope is already assigned', done => {
        clinicDependency.getClinic = jest.fn().mockReturnValue({
            stacks: [{id: 1, realGender: 'M', name: 'Bob', age: 75, idEnvelope: null}],
            envelopes: [{id: 1, gender: 'M', age: 75, idStack: 12}]
        })

        sendRequest(400, false, done)
    })

    it('When there are no backup envelopes', done => {
        clinicDependency.getClinic = jest.fn().mockReturnValue({
            stacks: [{realGender: 'M', name: 'Bob', age: 75, idEnvelope: null}],
        })

        sendRequest(404, true, done)
    })

    it('When data is fine with envelope ID', done => {
        clinicDependency.getClinic = jest.fn().mockReturnValue({
            stacks: [{id: 1, realGender: 'M', name: 'Bob', age: 75, idEnvelope: null}],
            envelopes: [{id: 1, gender: 'M', age: 75, idStack: null}]
        })

        sendRequest(204, false, done)
    })

    it('When data is fine with with backup envelope', done => {
        clinicDependency.getClinic = jest.fn().mockReturnValue({
            stacks: [{id: 1, realGender: 'M', name: 'Bob', age: 75, idEnvelope: null}],
            envelopes: [{id: 123, gender: 'M', age: 75, idStack: null}]
        })

        sendRequest(204, true, done)
    })
})
