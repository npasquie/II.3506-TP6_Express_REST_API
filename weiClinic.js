import { getNewId } from './idHelper'
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

    }

    removeStackFromEnvelope(idStack) {
        let findStack = false
        for (let i = 0; i < this.stacks.length; i++) {
            if (this.stacks[i].id == idStack) {
                for (let j = 0; j < this.envelopes.length; j++) {
                    if (this.envelopes[j].id === this.stacks[i].idEnvelope) {
                        this.stacks[i].idEnvelope = null
                        this.envelopes[j].idStack = null
                        findStack = true
                    }
                }
                
            }
        }
        return findStack
    }

    killEnvelope(idEnvelope) {
        for (let i = 0; i < this.envelopes.length; i++) {
            if (this.envelopes[i].id == idEnvelope) {
                this.envelopes.splice(i, 1)
            }
        }
    }

    destroyStack(idStack) {

    }
}

const weiClinic = new WeiClinic()

export const getClinic = () => weiClinic
