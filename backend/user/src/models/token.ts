import { prop, getModelForClass } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';

export class Token {
    public _id!: ObjectId;

    @prop({ required: true, type: ObjectId })
    public userId!: ObjectId;

    @prop({ required: true, type: String, unique: true })
    public token!: string;

    @prop({ required: false, type: Boolean, default: false })
    public expired?: boolean;
}

export const TokenModel = getModelForClass(Token);

export type TokenCreateAttributes = Omit<Token, '_id'>;
