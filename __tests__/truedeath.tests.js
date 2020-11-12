import request from 'supertest'
import app from '../src/controller/app'

import * as clinicDependency from '../src/weiClinic'

const returnValue400 = {
    status: 400,
    message: `Stack 1 not found`
}
const returnValue204 = {
    status: 204,
    message: {}
}

const sendRequest = (statusCode, done) => {
    let returnValue
    statusCode === 204 ? returnValue = returnValue204 : returnValue = returnValue400

    const destroyStack = jest.fn().mockReturnValue(returnValue)

    clinicDependency.getClinic.mockReturnValue({
        destroyStack: destroyStack
    })

    request(app)
        .delete('/truedeath/1')
        .expect(returnValue.status)
        .expect(response => {
            expect(response.body).toEqual(returnValue.message)
            expect(destroyStack).toHaveBeenCalledTimes(1)
            expect(destroyStack).toHaveBeenCalledWith("1")
        })
        .end(done)
}

beforeEach(() => {
    clinicDependency.getClinic = jest.fn().mockReturnValue({
        destroyStack: jest.fn(),
        stacks: [],
        envelopes: []
    })
})

describe('True Death action', () => {
    it('When the stack cannot be found', done => {
        sendRequest(400, done)
    })

    it('When data is fine', done => {
        clinicDependency.getClinic = jest.fn().mockReturnValue({
            stacks: [{id: 1, realGender: 'M', name: 'Bob', age: 75, idEnvelope: 1}]
        })

        sendRequest(204, done)
    })
})
