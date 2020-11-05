import request from 'supertest'
import app from '../app'

import * as clinicDependency from '../weiClinic'



describe('Kill action', () => {
    it('When the envelop cannot be found', (done) => {
        request(app)
            .post('/kill/42')
            .expect(400)
            .end(done)
    })
    
    it('When we can kill', (done) => {
        
        clinicDependency.getClinic().create('male', 75, 'Bob')
    
        request(app)
            .post('/kill/1')
            .expect(204)
            .end(done)
    })

})