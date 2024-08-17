import { prop, getModelForClass } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';

export class Session {
    public _id!: ObjectId;

    @prop({ required: true, type: String })
    public userId!: string;

    @prop({ required: true, type: String, unique: true })
    public token!: string;

    @prop({ required: true, type: Date })
    public expires!: Date;
}

export const SessionModel = getModelForClass(Session);
