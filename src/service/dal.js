import { createConnection } from 'typeorm'
import CorticalStack from '../models/corticalStack'
import Envelope from '../models/envelope'
import { corticalStackSchema } from '../models/corticalStackSchema'
import { envelopeSchema } from '../models/envelopeSchema'

class Dal {
    async connect() {
        try {
            return await createConnection({
                type: 'mysql',
                host: '0.0.0.0',
                port: 3306,
                username: 'root',
                password: 'root',
                database: 'db_alteredCarbon',
                entities: [envelopeSchema, corticalStackSchema]
            })
        } catch(err) {
            console.error('Unable to connect')
            throw err
        }
    }

    async getEnvelopes() {
        const connection = await this.connect()

        try {
            const envelopesRepository = connection.getRepository(Envelope)
            return await envelopesRepository.find()
        } catch(err) {
            console.error(err.message)
            throw err
        } finally {
            await connection.close()
        }
    }

    async getCorticalStacks() {
        const connection = await this.connect()

        try {
            const corticalStacksRepository = connection.getRepository(CorticalStack)
            return await corticalStacksRepository.find()
        } catch(err) {
            console.error(err.message)
            throw err
        } finally {
            await connection.close()
        }
    }

    async addData(gender, name, age, envelopeId, stackId) {
        const connection = await this.connect()
        try {
            const corticalStacksRepository = connection.getRepository(CorticalStack)
            const newCorticalStack = new CorticalStack(null, gender, name, age, envelopeId)
            await corticalStacksRepository.save(newCorticalStack)
            return newCorticalStack
        } catch (err) {
            console.error(err.message)
            throw err
        } finally {
            await this.addEnvelope(gender, name, age, stackId, connection)
        }
    }

    async addEnvelope(gender, name, age, stackId, connection) {
        try {
            const envelopesRepository = connection.getRepository(Envelope)
            const newEnvelope = new Envelope(null, gender, age, stackId)
            await envelopesRepository.save(newEnvelope)
            return newEnvelope
        } catch (err) {
            console.error(err.message)
            throw err 
        } finally {
            connection.close()
        }
    }

    async updateData(stack, envelope) {
        const connection = await this.connect()
        try {
            const corticalStacksRepository = connection.getRepository(CorticalStack)
            const corticalStackUpdated = new CorticalStack(stack.id, stack.gender, stack.age, stack.idStack)
            await corticalStacksRepository.save(stack)
            return corticalStackUpdated
        } catch (err) {
            console.error(err.message)
            throw err
        } finally {
            await this.updateEnvelope(envelope, connection)
        }
    }

    async updateEnvelope(envelope, connection) {
        try {
            const envelopesRepository = connection.getRepository(Envelope)
            const envelopeUpdated = new Envelope(envelope.id, envelope.gender, envelope.age, envelope.idStack)
            await envelopesRepository.save(envelope)
            return envelopeUpdated
        } catch (err) {
            console.error(err.message)
            throw err
        } finally {
            connection.close()
        }
    }

    async deleteEnvelope(envelope) {
        const connection = await this.connect()
        try {
            const envelopesRepository = connection.getRepository(Envelope)
            await envelopesRepository.delete(envelope)
        } catch (err) {
            console.error(err.message)
            throw err
        } finally {
            connection.close()
        }
    }

    async deleteCorticalStack(stack) {
        const connection = await this.connect()
        try {
            const corticalStacksRepository = connection.getRepository(CorticalStack)
            await corticalStacksRepository.delete(stack)
        } catch (err) {
            console.error(err.message)
            throw err
        } finally {
            connection.close()
        }
    }
}

export default Dal
