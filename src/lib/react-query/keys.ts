
export type UsersParams = { q: string; page: number; limit: number }
export const buildUsersKey = (p: UsersParams) => ['users', p]
