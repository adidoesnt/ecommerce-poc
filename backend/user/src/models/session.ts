import { prop, getModelForClass } from '@typegoose/typegoose';

export class Session {
    @prop({ required: true })
    public userId!: string;

    @prop({ required: true })
    public token!: string;

    @prop({ required: true })
    public expires!: Date;

    public static async create(session: Session) {
        return await SessionModel.create(session);
    }
}

const SessionModel = getModelForClass(Session);
