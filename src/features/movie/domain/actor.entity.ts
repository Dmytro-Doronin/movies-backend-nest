import {Prop} from "@nestjs/mongoose";

export class Actor {
    @Prop({ required: true })
    id: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    image: string;
}