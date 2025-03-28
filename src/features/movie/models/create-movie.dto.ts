import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'


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
  @IsString({ each: true })
  actors: string[]
}
