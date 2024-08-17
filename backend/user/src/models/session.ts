import { prop, getModelForClass } from '@typegoose/typegoose';

export class Session {
    @prop({ required: true })
    public userId!: string;

    @prop({ required: true })
    public token!: string;

    @prop({ required: true })
    public expires!: Date;
}

const SessionModel = getModelForClass(Session);

export default SessionModel;
