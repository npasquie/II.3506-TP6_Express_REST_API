import * as clinicDependency from '../src/weiClinic'


describe('destroyStack', () => {


    it('destroy the stack', () => {
        clinicDependency.getClinic().stacks = [{
            id: 1,
            realGender: 'M',
            name: 'Bob',
            age: 23,
            idEnvelope: null
        }]
        const response = clinicDependency.getClinic().destroyStack(1)
        const status204 = {status: 204, message: `Stack 1 destroyed`}
        
        expect(response).toEqual(status204)
    })
    it('stack not found', () => {
        clinicDependency.getClinic().stacks = []
        const response = clinicDependency.getClinic().destroyStack(1)
        const error400 = {status: 400, message: `Stack 1 not found`}

        expect(response).toEqual(error400)

    })
})

describe('killEnvelope', () => {

    it('Can kill the envelope', () => {
        clinicDependency.getClinic().envelopes = [{
            id: 1,
            gender: 'M',
            age: 23,
            idStack: null
        }]

        const response = clinicDependency.getClinic().killEnvelope(1)
        const status204 = {status: 204, message: `Envelope 1 killed`}

        expect(response).toEqual(status204)
    })

    it('Envelope not found', () => {
        clinicDependency.getClinic().envelopes = []

        const response = clinicDependency.getClinic().killEnvelope(1)
        const error400 = {status: 400, message: `Envelope 1 not found`}
        
        expect(response).toEqual(error400)
    })
})