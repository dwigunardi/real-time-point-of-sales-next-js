export type AuthFormState = {
    status?: string;
    errors?: {
        email?: string[];
        password?: string[];
        name?: string[];
        role?: string[];
        avatar_url?: string[];
        _form?: string[];
    };
};

export type LogoutFormState = {
    status?: string;
    message?: string;
};

export type Profile = {
    id?: string;
    name?: string;
    role?: string;
    avatar_url?: string;
}