import { config } from 'dotenv'
import * as process from 'process'

config()
export const jwtConstants = {
  secret: process.env.JWT_SECRET || '123',
}
