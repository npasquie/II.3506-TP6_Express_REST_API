import request from 'supertest'
import app from '../app'

import * as clinicDependency from '../weiClinic'



describe('Remove action', () => {
    it('When the stack cannot be found', (done) => {
        request(app)
            .post('/remove/42')
            .expect(400)
            .end(done)
    })
    it('When the envelope cannot be found', (done) => {

        clinicDependency.getClinic().create('male', 75, 'Bob')
        clinicDependency.getClinic().stacks[0].idEnvelope = null

        request(app)
            .post('/remove/1')
            .expect(400)
            .end(done)
    })
    it('When we can remove', (done) => {
        
        clinicDependency.getClinic().create('male', 75, 'Bob')
    
        request(app)
            .post('/remove/2')
            .expect(204)
            .end(done)
    })

})