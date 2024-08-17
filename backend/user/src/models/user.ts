import { prop, getModelForClass } from '@typegoose/typegoose';

export class User {
    @prop({ required: true })
    public firstName!: string;

    @prop()
    public middleName?: string;

    @prop({ required: true })
    public lastName!: string;

    @prop({ required: true })
    public email!: string;

    @prop({ required: true })
    public areaCode!: number;

    @prop({ required: true })
    public phone!: number;

    @prop({ required: true })
    public password!: string;
}

const UserModel = getModelForClass(User);

export default UserModel;
