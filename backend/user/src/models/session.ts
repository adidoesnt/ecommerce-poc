import { prop, getModelForClass } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';

export class Session {
    public _id!: ObjectId;

    @prop({ required: true, type: ObjectId })
    public userId!: ObjectId;

    @prop({ required: true, type: String, unique: true })
    public token!: string;

    @prop({ required: false, type: Boolean, default: false })
    public expired?: boolean;
}

export const SessionModel = getModelForClass(Session);

export type SessionCreateAttributes = Omit<Session, '_id'>;
