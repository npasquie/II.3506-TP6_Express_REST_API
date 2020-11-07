import request from 'supertest'
import app from '../app'

import * as clinicDependency from '../weiClinic'

describe('Implant action', () => {
    it('When data is fine', done => {
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
            .get('/implant/1/1')
            .expect(204)
            .expect(response => {
                expect(response.body).toEqual({})
                expect(assignStackToEnvelope).toHaveBeenCalledTimes(1)
            })
            .end(done)
    })
})
