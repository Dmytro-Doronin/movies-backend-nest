import {Prop} from "@nestjs/mongoose";
import {MovieDocument} from "../domain/movie.entity";

export class Actor {
    id: string;
    name: string;
    image: string;
}


export class MovieOutputModel {
    id: string;
    name: string;
    overview: string;
    userId: string;
    image?: string | null;
    genres?: string[] | null;
    rating?: number | null;
    releaseDate?: string | null;
    countries?: string[] | null;
    status?: string | null;
    languages?: string[] | null;
    budget?: string | null;
    revenue?: string | null;
    tagline?: string | null;
    companies?: string[] | null;
    actors?: Actor[] | null;
}

export class MovieFinalOutputModel {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: MovieOutputModel[]
}

export const MovieOutputModelMapper = (movie: MovieDocument) => {
    const outputModel = new MovieOutputModel();

    outputModel.id = movie.id;
    outputModel.userId = movie.userId;
    outputModel.name = movie.name;
    outputModel.image = movie.image;
    outputModel.userId = movie.userId;
    outputModel.overview = movie.overview;
    outputModel.genres = movie.genres;
    outputModel.rating = movie.rating;
    outputModel.releaseDate = movie.releaseDate;
    outputModel.countries = movie.countries;
    outputModel.status = movie.status;
    outputModel.languages = movie.languages;
    outputModel.budget = movie.budget;
    outputModel.revenue = movie.revenue;
    outputModel.tagline = movie.tagline;
    outputModel.companies = movie.companies;
    outputModel.actors = movie.actors;

    return outputModel;
}