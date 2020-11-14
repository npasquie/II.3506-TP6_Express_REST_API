import * as clinicDependency from '../src/weiClinic'


describe('assignStackToEnvelope', () => {

    it('can assign stack to an envelope', () => {
        clinicDependency.getClinic().stacks = [{
            id: 1,
            realGender: 'M',
            name: 'Bob',
            age: 23,
            idEnvelope: null
        }]
        clinicDependency.getClinic().envelopes = [{
            id: 1,
            gender: 'M',
            age: 23,
            idStack: null
        }]

        const response = clinicDependency.getClinic().assignStackToEnvelope(1, 1)
        const status204 = {status: 204, message: `Stack 1 assigned to envelope 1`}
        expect(response).toEqual(status204)
    })

    it('the stack is not found', () => {
        clinicDependency.getClinic().stacks = []
        clinicDependency.getClinic().envelopes = [{
            id: 1,
            gender: 'M',
            age: 23,
            idStack: null
        }]

        const response = clinicDependency.getClinic().assignStackToEnvelope(1, 1)
        const error400 = {status: 400, message: `Stack 1 or envelope 1 not found`}
        expect(response).toEqual(error400)
    })

    it('the envelope is not found', () => {
        clinicDependency.getClinic().stacks = [{
            id: 1,
            realGender: 'M',
            name: 'Bob',
            age: 23,
            idEnvelope: null
        }]
        clinicDependency.getClinic().envelopes = []

        const response = clinicDependency.getClinic().assignStackToEnvelope(1, 1)
        const error400 = {status: 400, message: `Stack 1 or envelope 1 not found`}
        expect(response).toEqual(error400)
    })

    it('there are no backup envelope', () => {
        clinicDependency.getClinic().stacks = [{
            id: 1,
            realGender: 'M',
            name: 'Bob',
            age: 23,
            idEnvelope: null
        },{
            id: 2,
            realGender: 'F',
            name: "Eve",
            age: 23,
            idEnvelope: 1
        }]
        clinicDependency.getClinic().envelopes = [{
            id: 1,
            gender: 'M',
            age: 23,
            idStack: 2
        }]

        const response = clinicDependency.getClinic().assignStackToEnvelope(1)
        const error404 = {status: 404, message: "No backup envelopes available"}
        expect(response).toEqual(error404)
    })

    describe('removeStackFromEnvelope', () => {

        it('can remove the stack', () => {
            clinicDependency.getClinic().stacks = [{
                id: 1,
                realGender: 'M',
                name: 'Bob',
                age: 56,
                idEnvelope: 1
            }]
            clinicDependency.getClinic().envelopes = [{
                id: 1,
                gender: 'M',
                age: 26,
                idStack: 1
            }]
            
            const response = clinicDependency.getClinic().removeStackFromEnvelope(1)
            const status204 = {status: 204, message: `Stack 1 removed from envelope 1`}

            expect(response).toEqual(status204)
        })

        it('stack not found', () => {
            clinicDependency.getClinic().stacks = []
            clinicDependency.getClinic().envelopes = []
            
            const response = clinicDependency.getClinic().removeStackFromEnvelope(1)
            const error400 = {status: 400, message: `Stack 1 or corresponding envelope not found`}

            expect(response).toEqual(error400)
        })

        it('stack not in an envelope', () => {
            clinicDependency.getClinic().stacks = [{
                id: 1,
                realGender: 'M',
                name: 'Bob',
                age: 56,
                idEnvelope: null
            }]
            clinicDependency.getClinic().envelopes = []
            
            const response = clinicDependency.getClinic().removeStackFromEnvelope(1)
            const error400 = {status: 400, message: `Stack 1 or corresponding envelope not found`}

            expect(response).toEqual(error400)
        })

    })



})

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