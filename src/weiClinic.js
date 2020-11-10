import {getNewId} from './idHelper'
import CorticalStack from './models/corticalStack'
import Envelope from './models/envelope'

class WeiClinic {
    constructor() {
        this.envelopes = []
        this.stacks = []
    }

    create(realGender, name, age) {
        const stackId = getNewId(this.stacks)
        const envelopeId = getNewId(this.envelopes)
        const newStack = new CorticalStack(stackId, realGender, name, age, envelopeId)
        const newEnvelope = new Envelope(envelopeId, realGender, age, stackId)

        this.stacks.push(newStack)
        this.envelopes.push(newEnvelope)

        return {
            corticalStack: newStack,
            envelope: newEnvelope
        }
    }

    assignStackToEnvelope(idStack, idEnvelope) {
        const stackId = parseInt(idStack)
        const stackFound = this.stacks.find((stack) => {
            return stack.id === stackId
        })
        if (stackFound === undefined) return 0
        if (idEnvelope !== undefined) {
            let envelopeId = parseInt(idEnvelope)
            const envelopeFound = this.envelopes.find((envelope) => {
                return envelope.id === envelopeId
            })
            if (envelopeFound === undefined) return 0
            stackFound.idEnvelope = envelopeId
            envelopeFound.idStack = stackId
        } else {
            const backupEnvelope = this.envelopes.find((envelope) => {
                return envelope.id === null
            })
            if (backupEnvelope === undefined) return 1
            backupEnvelope.idStack = stackId
            stackFound.idEnvelope = backupEnvelope.id
        }
        return 2
    }

    removeStackFromEnvelope(idStack) {
        const stackId = parseInt(idStack)
        const stackFound = this.stacks.find((stack) => {
            return stack.id === stackId
        })
        if (stackFound === undefined) return false
        const envelopeId = stackFound.idEnvelope
        const envelopeFound = this.envelopes.find((envelope) => {
            return envelope.id === envelopeId
        })
        if (envelopeFound === undefined) return false

        stackFound.idEnvelope = null
        envelopeFound.idStack = null
        return true
    }

    killEnvelope(idEnvelope) {
        const envelopeId = parseInt(idEnvelope)
        const envelopeFound = this.envelopes.find((envelope) => {
            return envelope.id === envelopeId
        })
        if (envelopeFound === undefined) return false
        if (envelopeFound.idStack !== null) this.removeStackFromEnvelope(envelopeFound.idStack)
        this.envelopes.filter((envelope) => {
            return envelope.id !== envelopeFound.id
        })
        return true
    }

    destroyStack(idStack) {
        const stackId = parseInt(idStack)
        const stackFound = this.stacks.find((stack) => {
            return stack.id === stackId
        })
        if (stackFound === undefined) return false
        if (stackFound.idEnvelope !== null) this.killEnvelope(stackFound.idEnvelope)
        this.stacks.filter(stack => {
            return stack.id !== stackFound.id
        })
        return true
    }
}

const weiClinic = new WeiClinic()

export let getClinic = () => weiClinic
