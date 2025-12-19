'use server'

import { INITIAL_STATE_CREATE_USER } from "@/constants/user-constant";
import { createClient } from "@/lib/supabase/server";
import { UserFormState } from "@/types/user";
import { parsedErrorUserFormState } from "@/utils/general-zod-tree-error";
import { createUserSchemaForm } from "@/validations/user-validation";

export async function createUser(prevState: UserFormState, formData: FormData | null) {

    if (!formData) {
        return INITIAL_STATE_CREATE_USER;
    }

    const validatedFields = createUserSchemaForm.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
        name: formData.get('name'),
        role: formData.get('role'),
        // avatar_url: formData.get('avatar_url'),
    });

    if (!validatedFields.success) {
        return {
            status: 'error',
            errors: parsedErrorUserFormState(validatedFields.error),
        };
    }

    const supabase = await createClient()

    const { error } = await supabase.auth.signUp({
        email: validatedFields.data.email,
        password: validatedFields.data.password,
        options: {
            data: {
                name: validatedFields.data.name,
                role: validatedFields.data.role.toLowerCase(),
                // avatar_url: validatedFields.data.avatar_url
            }
        }
    })

    if (error) {
        return {
            status: 'error',
            errors: {
                ...prevState.errors,
                _form: [error.message],
            },
        };
    }

    return { status: 'success' }
}