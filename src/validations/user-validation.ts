import { Roles } from "@/constants/role-constant";
import z from "zod";

export const createUserSchemaForm = z.object({
    email: z.email({ message: 'Please enter a valid email' }).min(1, 'Email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password must be at most 100 characters'),
    name: z.string().min(1, 'Name is required'),
    role: z.enum(Object.values(Roles), { message: 'Role is required' }),
    // avatar_url: z.union([z.string().min(1, 'Avatar URL is required'), z.instanceof(File)], { message: 'Avatar URL is required' }).optional(),
});

export type CreateUserForm = z.infer<typeof createUserSchemaForm>

export const updateUserSchemaForm = z.object({
    email: z.email({ message: 'Please enter a valid email' }).min(1, 'Email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password must be at most 100 characters').optional().or(z.literal('')),
    name: z.string().min(1, 'Name is required'),
    role: z.enum(Object.values(Roles), { message: 'Role is required' }),
    //avatar_url: z.union([z.string().min(1, 'Avatar URL is required'), z.instanceof(File)], { message: 'Avatar URL is required' }).optional(),
});

export type UpdateUserForm = z.infer<typeof updateUserSchemaForm>