import * as clinicDependency from '../src/weiClinic'

describe('Create Action', () => {

    it('Can create', () => {
        clinicDependency.getClinic().stacks = []
        clinicDependency.getClinic().envelopes = []

        const response = clinicDependency.getClinic().create('M', 'Bob', 23)
        expect(response).resolves.toEqual({status: 200, message: `Stack 1 created with envelope 1`})
    })
})

describe('AssignStackToEnvelope Action', () => {

    it('Can assign stack to an envelope', () => {
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
        expect(response).resolves.toEqual(status204)
    })

    it('Stack is not found', () => {
        clinicDependency.getClinic().stacks = []
        clinicDependency.getClinic().envelopes = [{
            id: 1,
            gender: 'M',
            age: 23,
            idStack: null
        }]

        const response = clinicDependency.getClinic().assignStackToEnvelope(1, 1)
        const error400 = {status: 400, message: `Stack 1 or envelope 1 not found`}
        expect(response).resolves.toEqual(error400)
    })

    it('Envelope is not found', () => {
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
        expect(response).resolves.toEqual(error400)
    })

    it('No backup envelope', () => {
        clinicDependency.getClinic().stacks = [{
            id: 1,
            realGender: 'M',
            name: 'Bob',
            age: 23,
            idEnvelope: null
        }, {
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
        expect(response).resolves.toEqual(error404)
    })

    describe('RemoveStackFromEnvelope Action', () => {

        it('Can remove the stack', () => {
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

            expect(response).resolves.toEqual(status204)
        })

        it('Stack not found', () => {
            clinicDependency.getClinic().stacks = []
            clinicDependency.getClinic().envelopes = []

            const response = clinicDependency.getClinic().removeStackFromEnvelope(1)
            const error400 = {status: 400, message: `Stack 1 or corresponding envelope not found`}

            expect(response).resolves.toEqual(error400)
        })

        it('Stack not in an envelope', () => {
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

            expect(response).resolves.toEqual(error400)
        })
    })
})

describe('DestroyStack Action', () => {

    it('Can destroy the stack', () => {
        clinicDependency.getClinic().stacks = [{
            id: 1,
            realGender: 'M',
            name: 'Bob',
            age: 23,
            idEnvelope: null
        }]
        const response = clinicDependency.getClinic().destroyStack(1)
        const status204 = {status: 204, message: `Stack 1 destroyed`}

        expect(response).resolves.toEqual(status204)
    })
    it('Stack not found', () => {
        clinicDependency.getClinic().stacks = []
        const response = clinicDependency.getClinic().destroyStack(1)
        const error400 = {status: 400, message: `Stack 1 not found`}

        expect(response).resolves.toEqual(error400)

    })
})

describe('KillEnvelope Action', () => {

    it('Can kill the envelope', () => {
        clinicDependency.getClinic().envelopes = [{
            id: 1,
            gender: 'M',
            age: 23,
            idStack: null
        }]

        const response = clinicDependency.getClinic().killEnvelope(1)
        const status204 = {status: 204, message: `Envelope 1 killed`}

        expect(response).resolves.toEqual(status204)
    })

    it('Envelope not found', () => {
        clinicDependency.getClinic().envelopes = []

        const response = clinicDependency.getClinic().killEnvelope(1)
        const error400 = {status: 400, message: `Envelope 1 not found`}

        expect(response).resolves.toEqual(error400)
    })
})
