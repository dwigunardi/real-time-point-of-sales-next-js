export type formState = {
    errors: {
        _form?: string[]
    },
    status?: string
}

export type ActionResult<T = unknown> =
    | { status: "success"; data?: T }
    | { status: "error"; message: string }
    | { status: "loading" };