import {Injectable, NotFoundException} from '@nestjs/common'
import {CreateUserDto} from '../models/create-user.dto'
import * as bcrypt from 'bcryptjs'
import {v4 as uuidv4} from 'uuid'
import {User} from '../domain/user.entity'
import {UserRepository} from '../repositories/user.repository'
import {UserOutputMapper} from '../models/user-output.model'
import {UserQueryRepository} from '../repositories/user-query.repository'
import {MovieRepository} from '../../movie/repositories/movie.repository'
import {MovieOutputModelMapper} from '../../movie/models/movie-output.model'

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private userQueryRepository: UserQueryRepository,
    private movieRepository: MovieRepository
  ) {}

  async createUser({ login, password, email }: CreateUserDto) {
    const passwordSalt = await bcrypt.genSalt(10)
    const passwordHash = await this._generateHash(password, passwordSalt)

    const newUser = User.create({
      id: uuidv4(),
      login,
      email,
      passwordSalt,
      passwordHash,
      imageUrl: 'asd',
      wishlist: [],
    })

    const user = await this.userRepository.createUser(newUser)

    if (!user) {
      return null
    }

    return UserOutputMapper(user)
  }

  async addToWishlist(userId: string, movieId: string) {
    const user = await this.userQueryRepository.getUserById(userId)

    if (!user) {
      throw new NotFoundException('User not found')
    }

    const exists = user.wishlist.some(item => item.movieId === movieId)

    if (exists) {
      return null
    }

    const maxOrder = user.wishlist.length > 0 ? Math.max(...user.wishlist.map(i => i.order)) : 0

    const updatedWishlist = [...(user.wishlist || []), { movieId, order: maxOrder + 1 }]

    const updatedUser = await this.userRepository.changeWishlist(userId, updatedWishlist)

    if (!updatedUser) {
      return null
    }

    return UserOutputMapper(updatedUser)
  }

  async reorderWishlist(userId: string, newOrder: string[]) {
    const reordered = newOrder.map((movieId, index) => ({
      movieId,
      order: index,
    }))

    const updatedUser = await this.userRepository.changeWishlist(userId, reordered)

    if (!updatedUser) {
      return null
    }

    return UserOutputMapper(updatedUser)
  }

  async getWishlistWithMovies(userId: string) {
    const user = await this.userQueryRepository.getUserById(userId)
    if (!user) {
      throw new NotFoundException('User not found')
    }

    const movieIds = user.wishlist.map(item => item.movieId)
    const movies = await this.movieRepository.getWishlist(movieIds)
    const mappedMovies = movies.map(MovieOutputModelMapper)

    const movieMap = new Map(mappedMovies.map(m => [m.id, m]))

    return user.wishlist
        .sort((a, b) => a.order - b.order)
        .map(item => ({
            ...item,
            movie: movieMap.get(item.movieId),
        }))
  }

  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt)
  }
}
