import { config } from 'dotenv'

config()

export type EnvironmentVariable = { [key: string]: string | undefined }
export type EnvironmentsTypes = 'DEVELOPMENT' | 'STAGING' | 'PRODUCTION' | 'TESTING'
export const Environments = ['DEVELOPMENT', 'STAGING', 'PRODUCTION', 'TESTING']

export class EnvironmentSettings {
  constructor(private env: EnvironmentsTypes) {}

  getEnv() {
    return this.env
  }

  isProduction() {
    return this.env === 'PRODUCTION'
  }

  isStaging() {
    return this.env === 'STAGING'
  }

  isDevelopment() {
    return this.env === 'DEVELOPMENT'
  }

  isTesting() {
    return this.env === 'TESTING'
  }
}

class AppSettings {
  constructor(
    public env: EnvironmentSettings,
    public api: APISettings
  ) {}
}

class APISettings {
  // Application
  public readonly PORT: number

  // Database
  public readonly MONGO_URL: string

  constructor(private readonly envVariables: EnvironmentVariable) {
    // Application
    this.PORT = this.getNumberOrDefault(
      envVariables.PORT !== undefined ? envVariables.PORT : '',
      3000
    )

    // Database
    this.MONGO_URL =
      envVariables.MONGO_URL !== undefined ? envVariables.MONGO_URL : 'mongodb://localhost/nest'
  }

  private getNumberOrDefault(value: string, defaultValue: number): number {
    const parsedValue = Number(value)

    if (isNaN(parsedValue)) {
      return defaultValue
    }

    return parsedValue
  }
}
//sda
const env = new EnvironmentSettings(
  (Environments.includes(process.env.ENV?.trim() || 'DEVELOPMENT')
    ? process.env.ENV?.trim()
    : 'DEVELOPMENT') as EnvironmentsTypes
)

const api = new APISettings(process.env)
export const appSettings = new AppSettings(env, api)
