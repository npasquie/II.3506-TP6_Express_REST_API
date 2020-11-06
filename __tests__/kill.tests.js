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
    
        request(app)
            .post('/kill/1')
            .expect(204)
            .end(done)
    })
})