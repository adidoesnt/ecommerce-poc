import {
    prop,
    getModelForClass,
    index,
} from '@typegoose/typegoose';
import type { ObjectId } from 'mongoose';

@index({ areaCode: 1, phone: 1 }, { unique: true })
export class User {
    public _id!: ObjectId;

    @prop({ required: true, type: String })
    public firstName!: string;

    @prop({ type: String })
    public middleName?: string;

    @prop({ required: true, type: String })
    public lastName!: string;

    @prop({ required: true, unique: true, type: String })
    public email!: string;

    @prop({ required: true, type: Number })
    public areaCode!: number;

    @prop({ required: true, type: Number })
    public phone!: number;

    @prop({ required: true, type: String })
    public password!: string;
}

export const UserModel = getModelForClass(User);
