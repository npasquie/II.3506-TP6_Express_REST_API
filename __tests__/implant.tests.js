import request from 'supertest'
import app from '../src/controller/app'

import * as clinicDependency from '../src/weiClinic'

describe('Implant action', () => {
    it('When the stack cannot be found', done => {
        request(app)
            .put('/implant/1/1')
            .expect(400)
            .end(done)
    })

    it('When data is fine with envelope ID', done => {
        clinicDependency.getClinic().create('M', 'Jack', 25)
        clinicDependency.getClinic().envelopes[0].idStack = null
        clinicDependency.getClinic().stacks[0].idEnvelope = null

        clinicDependency.getClinic = jest.fn().mockReturnValue({
            assignStackToEnvelope: jest.fn()
        })

        const assignStackToEnvelope = jest.fn().mockReturnValue(true)

        clinicDependency.getClinic.mockReturnValue({
            assignStackToEnvelope
        })

        request(app)
            .put('/implant/1/1')
            .expect(200)
            .expect(response => {
                expect(response.body).toEqual({})
                expect(assignStackToEnvelope).toHaveBeenCalledTimes(1)
            })
            .end(done)
    })
})
