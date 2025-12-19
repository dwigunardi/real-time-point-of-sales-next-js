export const HEADER_TABLE_USER = ['No', 'ID', 'Name', 'Role', 'Actions']
export const INITIAL_CREATE_USER_FORM = {
    name: '',
    role: '',
    avatar_url: '',
    email: '',
    password: '',
}
export const INITIAL_STATE_CREATE_USER = {
    status: 'idle',
    errors: {
        email: [],
        password: [],
        name: [],
        role: [],
        avatar_url: [],
        _form: [],
    },
};