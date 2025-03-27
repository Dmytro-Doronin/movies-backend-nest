import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

class ActorDto {
  @IsString()
  @IsNotEmpty()
  id: string

  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  image: string
}

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  overview: string

  @IsOptional()
  @IsString()
  image: string | null

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genres?: string[]

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  rating?: number

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  releaseDate?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  countries?: string[]

  @IsOptional()
  @IsString()
  status?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[]

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  budget?: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  revenue?: string

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  tagline?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  companies?: string[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActorDto)
  actors?: ActorDto[]
}
