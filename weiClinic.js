import {getNewId} from './idHelper'
import CorticalStack from './corticalStack'
import Envelope from './Envelope'

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
        let returnStatus = 0
        for (let i = 0; i < this.stacks.length; i++) {
            let stack = this.stacks[i]
            if (stack.id === idStack) {
                if (idEnvelope === null) {
                    for (let j = 0; j < this.envelopes.length; i++) {
                        let envelope = this.envelopes[i]
                        if (envelope.idStack === null) {
                            idEnvelope = envelope.id
                        }
                    }
                    returnStatus = 1
                }
                if (idEnvelope !== null) {
                    for (let j = 0; j < this.envelopes.length; j++) {
                        let envelope = this.envelopes[j]
                        if (envelope.id === idEnvelope) {
                            stack.idEnvelope = idEnvelope
                            envelope.idStack = idStack
                            returnStatus = 2
                        }
                    }
                }
            }
        }
        return returnStatus
    }

    removeStackFromEnvelope(idStack) {
        let done = false
        for (let i = 0; i < this.stacks.length; i++) {
            if (this.stacks[i].id === idStack) {
                for (let j = 0; j < this.envelopes.length; j++) {
                    if (this.envelopes[j].id === this.stacks[i].idEnvelope) {
                        this.stacks[i].idEnvelope = null
                        this.envelopes[j].idStack = null
                        done = true
                    }
                }
            }
        }
        return done
    }

    killEnvelope(idEnvelope) {
        let done = false
        for (let i = 0; i < this.envelopes.length; i++) {
            let envelope = this.envelopes[i]
            if (envelope === idEnvelope) {
                if (envelope.idStack !== null) {
                    this.removeStackFromEnvelope(envelope.idStack)
                }
                this.envelopes.splice(i, 1)
                done = true
            }
        }
        return done
    }

    destroyStack(idStack) {
        let done = false;
        for (let i = 0; i < this.stacks.length; i++) {
            let stack = this.stacks[i]
            if (stack.id === idStack) {
                if (stack.idEnvelope !== null) {
                    this.killEnvelope(stack.idEnvelope)
                }
                this.stacks.splice(i, 1)
                done = true
            }
        }
        return done
    }
}

const weiClinic = new WeiClinic()

export let getClinic = () => weiClinic
