import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {ActorController} from "./controller/actor.controller";
import {Actor, ActorSchema} from "./domain/actor.entity";
import {ActorQueryRepository} from "./repositories/actor-query.repository";
import {ActorRepository} from "./repositories/actor.repository";
import {S3Service} from "../../common/services/s3.service";
import {ActorService} from "./service/actor.service";

@Module({
    imports: [MongooseModule.forFeature([{ name: Actor.name, schema: ActorSchema }])],
    providers: [ActorQueryRepository, ActorRepository, S3Service, ActorService],
    controllers: [ActorController],
    exports: [ActorQueryRepository, ActorRepository, S3Service, ActorService],
})
export class ActorModule {

}