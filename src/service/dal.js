import { createConnection } from 'typeorm'
import CorticalStack from '../models/corticalStack'
import { corticalStackSchema } from '../models/corticalStackSchema'
import Envelope from '../models/envelope'
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

    async addEnvelope(id, gender, age, idStack) {
        const connection = await this.connect()

        try {
            const envelopesRepository = connection.getRepository(Envelope)
            const newEnvelope = new Envelope(id, gender, age, idStack)
            await envelopesRepository.save(newEnvelope)
            return newEnvelope
        } catch (err) {
            console.error(err.message)
            throw err 
        } finally {
            connection.close()
        }
    }

    async addCorticalStack(id, realGender, name, age, idEnvelope) {
        const connection = await this.connect()

        try {
            const corticalStacksRepository = connection.getRepository(CorticalStack)
            const newCorticalStack = new CorticalStack(id, realGender, name, age, idEnvelope)
            await corticalStacksRepository.save(newCorticalStack)
            return newCorticalStack
        } catch (err) {
            console.error(err.message)
            throw err 
        } finally {
            connection.close()
        }
    }
}

export default Dal
