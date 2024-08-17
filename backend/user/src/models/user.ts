import { prop, getModelForClass, index } from '@typegoose/typegoose';

@index({ areaCode: 1, phone: 1 }, { unique: true })
export class User {
    @prop({ required: true })
    public firstName!: string;

    @prop()
    public middleName?: string;

    @prop({ required: true })
    public lastName!: string;

    @prop({ required: true, unique: true })
    public email!: string;

    @prop({ required: true })
    public areaCode!: number;

    @prop({ required: true })
    public phone!: number;

    @prop({ required: true })
    public password!: string;

    public static async create(user: User) {
        return await UserModel.create(user);
    }
}

const UserModel = getModelForClass(User);
