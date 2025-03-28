import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'


export class CreateActorDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsOptional()
  @IsString()
  image: string | null

}
