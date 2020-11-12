import CorticalStack from './models/corticalStack'
import Envelope from './models/envelope'
import Dal from "./service/dal";

class WeiClinic {
    constructor() {
        this.dal = new Dal()
        this.dal.getEnvelopes().then(data => {
            this.envelopes = data
        }).catch(error => {
            console.error(error)
        })
        this.dal.getCorticalStacks().then(data => {
            this.stacks = data
        }).catch(error => {
            console.error(error)
        })
    }

    create(realGender, name, age) {
        const stackId = this.stacks.length + 1
        const envelopeId = this.envelopes.length + 1
        const newStack = new CorticalStack(stackId, realGender, name, age, envelopeId)
        const newEnvelope = new Envelope(envelopeId, realGender, age, stackId)

        this.dal.addCorticalStack(stackId, realGender, name, age, envelopeId)
        this.dal.addEnvelope(envelopeId, realGender, age, stackId)
        this.updateEnvelopesAndStacks()

        return {
            corticalStack: newStack,
            envelope: newEnvelope
        }
    }

    assignStackToEnvelope(idStack, idEnvelope) {
        const error400 = {status: 400, message: `Stack ${idStack} or envelope ${idEnvelope} not found`}
        const error404 = {status: 404, message: "No backup envelopes available"}
        const status204 = {status: 204, message: `Stack ${idStack} assigned to envelope ${idEnvelope}`}
        const stackId = parseInt(idStack)
        const stackFound = this.stacks.find(stack => {
            return stack.id === stackId
        })
        if (stackFound === undefined) return error400
        if (idEnvelope !== undefined) {
            let envelopeId = parseInt(idEnvelope)
            const envelopeFound = this.envelopes.find(envelope => {
                return envelope.id === envelopeId
            })
            if (envelopeFound === undefined) return error400
            stackFound.idEnvelope = envelopeId
            envelopeFound.idStack = stackId
            this.dal.updateCorticalStack(stackFound)
            this.dal.updateEnvelope(envelopeFound)
            this.updateEnvelopesAndStacks()
        } else {
            const backupEnvelope = this.envelopes.find(envelope => {
                return envelope.id === null
            })
            if (backupEnvelope === undefined) return error404
            backupEnvelope.idStack = stackId
            stackFound.idEnvelope = backupEnvelope.id
        }
        return status204
    }

    removeStackFromEnvelope(idStack) {
        const error400 = {status: 400, message: `Stack ${idStack} or corresponding envelope not found`}
        const stackId = parseInt(idStack)
        const stackFound = this.stacks.find(stack => {
            return stack.id === stackId
        })
        if (stackFound === undefined) return error400
        const envelopeId = stackFound.idEnvelope
        const status204 = {status: 204, message: `Stack ${idStack} removed from envelope ${envelopeId}`}
        const envelopeFound = this.envelopes.find(envelope => {
            return envelope.id === envelopeId
        })
        if (envelopeFound === undefined) return error400

        stackFound.idEnvelope = null
        envelopeFound.idStack = null

        this.dal.updateCorticalStack(stackFound)
        this.dal.updateEnvelope(envelopeFound)
        this.updateEnvelopesAndStacks()

        return status204
    }

    killEnvelope(idEnvelope) {
        const error400 = {status: 400, message: `Envelope ${idEnvelope} not found`}
        const status204 = {status: 204, message: `Envelope ${idEnvelope} killed`}
        const envelopeId = parseInt(idEnvelope)
        const envelopeFound = this.envelopes.find(envelope => {
            return envelope.id === envelopeId
        })
        if (envelopeFound === undefined) return error400
        if (envelopeFound.idStack !== null) this.removeStackFromEnvelope(envelopeFound.idStack)
        //todo DB delete
        this.dal.deleteEnvelope(envelopeFound)
        this.updateEnvelopesAndStacks()
        this.envelopes.filter(envelope => {
            return envelope.id !== envelopeFound.id
        })
        return status204
    }

    destroyStack(idStack) {
        const error400 = {status: 400, message: `Stack ${idStack} not found`}
        const status204 = {status: 204, message: `Stack ${idStack} destroyed`}
        const stackId = parseInt(idStack)
        const stackFound = this.stacks.find(stack => {
            return stack.id === stackId
        })
        if (stackFound === undefined) return error400
        if (stackFound.idEnvelope !== null) this.killEnvelope(stackFound.idEnvelope)
        //todo DB delete
        this.dal.deleteCorticalStack(stackFound)
        this.updateEnvelopesAndStacks()
        this.stacks.filter(stack => {
            return stack.id !== stackFound.id
        })
        return status204
    }

    updateEnvelopesAndStacks() {
        this.dal.getEnvelopes().then(data => {
            this.envelopes = data
        }).catch(error => {
            console.error(error)
        })
        this.dal.getCorticalStacks().then(data => {
            this.stacks = data
        }).catch(error => {
            console.error(error)
        })
    }
}

const weiClinic = new WeiClinic()

export let getClinic = () => weiClinic
