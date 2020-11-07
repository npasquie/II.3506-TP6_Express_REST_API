import request from 'supertest'
import app from '../app'

import * as clinicDependency from '../weiClinic'

describe('True Death action', () => {
    it('When the stack cannot be found', (done) => {
        request(app)
            .delete('/truedeath/1')
            .expect(400)
            .end(done)
    })

    it('When data is fine', done => {
        clinicDependency.getClinic().create('M', 'Bob', 75)

        clinicDependency.getClinic = jest.fn().mockReturnValue({
            destroyStack: jest.fn(),
        })

        const destroyStack = jest.fn().mockReturnValue(true)

        clinicDependency.getClinic.mockReturnValue({
            destroyStack,
        })

        request(app)
            .delete('/truedeath/1')
            .expect(204)
            .expect(response => {
                expect(response.body).toEqual({})
                expect(destroyStack).toHaveBeenCalledTimes(1)
                expect(destroyStack).toHaveBeenCalledWith("1")
            })
            .end(done)
    })
})
