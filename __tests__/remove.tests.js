import request from 'supertest'
import app from '../src/controller/app'

import * as clinicDependency from '../src/weiClinic'

describe('Remove action', () => {
    it('When the stack cannot be found', (done) => {
        request(app)
            .post('/remove/1')
            .expect(400)
            .end(done)
    })

    it('When the envelope cannot be found', (done) => {
        clinicDependency.getClinic().create('M', 'Bob', 75)
        clinicDependency.getClinic().stacks[0].idEnvelope = null

        request(app)
            .post('/remove/1')
            .expect(400)
            .end(done)
    })

    it('When we can remove', (done) => {
        clinicDependency.getClinic().create('M', 'Bob', 75)

        clinicDependency.getClinic = jest.fn().mockReturnValue({
            removeStackFromEnvelope: jest.fn(),
        })

        const removeStackFromEnvelope = jest.fn().mockReturnValue(true)

        clinicDependency.getClinic.mockReturnValue({
            removeStackFromEnvelope,
        })

        request(app)
            .post('/remove/2')
            .expect(204)
            .expect(response => {
                expect(response.body).toEqual({})
                expect(removeStackFromEnvelope).toHaveBeenCalledTimes(1)
                expect(removeStackFromEnvelope).toHaveBeenCalledWith("2")
            })
            .end(done)
    })
})
