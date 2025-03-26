import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class RefreshTokenEntity extends Document {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    token: string;

    @Prop({ default: Date.now, expires: '7d' })
    createdAt: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshTokenEntity);