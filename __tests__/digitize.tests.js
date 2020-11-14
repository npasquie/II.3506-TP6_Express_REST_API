import request from 'supertest'
import app from '../src/controller/app'

import * as clinicDependency from '../src/weiClinic'

const AGE = 47
const GENDER = 'M'
const NAME = 'Elias Ryker'

beforeEach(() => {
    clinicDependency.getClinic = jest.fn().mockReturnValue({
        create: jest.fn()
    })
})

describe('Digitize action', () => {
    it('When data is fine', (done) => {
        const query = {
            gender: GENDER,
            age: AGE,
            name: NAME
        }

        const expectedResponseBody = {
            status: 200,
            message: `Stack 1 created with envelope 1`
        }

        const create = jest.fn().mockReturnValue(expectedResponseBody)

        clinicDependency.getClinic.mockReturnValue({
            create
        })

        request(app)
            .get('/digitize')
            .query(query)
            .expect(expectedResponseBody.status)
            .expect('Content-Type', /json/)
            .expect(response => {
                expect(response.body).toEqual(expectedResponseBody.message)
                expect(create).toHaveBeenCalledTimes(1)
                expect(create).toHaveBeenCalledWith(GENDER, NAME, AGE)
            })
            .end(done)
    })
})
