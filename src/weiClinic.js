import Dal from "./service/dal";

class WeiClinic {
    constructor() {
        this.dal = new Dal()
        this.getEnvelopesAndStacks()
    }

    getEnvelopesAndStacks() {
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

    async create(realGender, name, age) {
        const stackId = this.stacks.length + 1
        const envelopeId = this.envelopes.length + 1
        const status200 = {status: 200, message: `Stack ${stackId} created with envelope ${envelopeId}`}
        await this.dal.addData(realGender, name, age, envelopeId, stackId)
        return status200
    }

    async assignStackToEnvelope(idStack, idEnvelope) {
        const error400 = {status: 400, message: `Stack ${idStack} or envelope ${idEnvelope} not found`}
        const error404 = {status: 404, message: "No backup envelopes available"}
        const status204 = {status: 204, message: `Stack ${idStack} assigned to envelope ${idEnvelope}`}
        const stackId = parseInt(idStack)
        const stackFound = this.stacks.find(stack => {
            return stack.id === stackId
        })
        if (stackFound === undefined || stackFound.idEnvelope !== null) return error400
        if (idEnvelope !== undefined) {
            let envelopeId = parseInt(idEnvelope)
            const envelopeFound = this.envelopes.find(envelope => {
                return envelope.id === envelopeId
            })
            if (envelopeFound === undefined || envelopeFound.idStack !== null) return error400
            stackFound.idEnvelope = envelopeId
            envelopeFound.idStack = stackId
            await this.dal.updateData(stackFound, envelopeFound)
        } else {
            const backupEnvelope = this.envelopes.find(envelope => {
                return envelope.idStack === null
            })
            if (backupEnvelope === undefined) return error404
            backupEnvelope.idStack = stackId
            stackFound.idEnvelope = backupEnvelope.id
            await this.dal.updateData(stackFound, backupEnvelope)
        }
        return status204
    }

    async removeStackFromEnvelope(idStack) {
        const error400 = {status: 400, message: `Stack ${idStack} or corresponding envelope not found`}
        const stackId = parseInt(idStack)
        const stackFound = this.stacks.find(stack => {
            return stack.id === stackId
        })
        if (stackFound === undefined) return error400
        const envelopeId = stackFound.idEnvelope
        if (envelopeId === null) return error400
        const status204 = {status: 204, message: `Stack ${idStack} removed from envelope ${envelopeId}`}
        const envelopeFound = this.envelopes.find(envelope => {
            return envelope.id === envelopeId
        })
        if (envelopeFound === undefined) return error400
        stackFound.idEnvelope = null
        envelopeFound.idStack = null
        await this.dal.updateData(stackFound, envelopeFound)
        return status204
    }

    async killEnvelope(idEnvelope) {
        const error400 = {status: 400, message: `Envelope ${idEnvelope} not found`}
        const status204 = {status: 204, message: `Envelope ${idEnvelope} killed`}
        const envelopeId = parseInt(idEnvelope)
        const envelopeFound = this.envelopes.find(envelope => {
            return envelope.id === envelopeId
        })
        if (envelopeFound === undefined) return error400
        if (envelopeFound.idStack !== null) await this.removeStackFromEnvelope(envelopeFound.idStack)
        await this.dal.deleteEnvelope(envelopeFound)
        return status204
    }

    async destroyStack(idStack) {
        const error400 = {status: 400, message: `Stack ${idStack} not found`}
        const status204 = {status: 204, message: `Stack ${idStack} destroyed`}
        const stackId = parseInt(idStack)
        const stackFound = this.stacks.find(stack => {
            return stack.id === stackId
        })
        if (stackFound === undefined) return error400
        if (stackFound.idEnvelope !== null) await this.killEnvelope(stackFound.idEnvelope)
        await this.dal.deleteCorticalStack(stackFound)
        return status204
    }
}

const weiClinic = new WeiClinic()

export let getClinic = () => weiClinic
