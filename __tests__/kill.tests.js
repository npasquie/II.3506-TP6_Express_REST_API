import request from 'supertest'
import app from '../app'

import * as clinicDependency from '../weiClinic'

describe('Kill action', () => {
    it('When the envelope cannot be found', (done) => {
        request(app)
            .post('/kill/1')
            .expect(400)
            .end(done)
    })
    
    it('When we can kill', (done) => {
        clinicDependency.getClinic().create('M', 'Bob', 75)

        clinicDependency.getClinic = jest.fn().mockReturnValue({
            killEnvelope: jest.fn(),
        })

        const killEnvelope = jest.fn().mockReturnValue(true)

        clinicDependency.getClinic.mockReturnValue({
            killEnvelope,
        })

        request(app)
            .post('/kill/1')
            .expect(204)
            .expect(response => {
                expect(response.body).toEqual({})
                expect(killEnvelope).toHaveBeenCalledTimes(1)
                expect(killEnvelope).toHaveBeenCalledWith("1")
            })
            .end(done)
    })
})
