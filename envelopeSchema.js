import Envelope from './envelope'
import { EntitySchema } from 'typeorm'

export const envelopeSchema = new EntitySchema({
    tableName: 'Envelopes',
    name: 'envelope',
    target: Envelope,
    colums: {
        id: {
            primary: true,
            generated: true,
            type: 'int'
        },
        gender: {
            type: 'varchar',
            nullable: false
        },
        age: {
            type: 'int',
            nullable: false
        },
        idStack: {
            type: 'int',
            nullable: true
        }
    }
})