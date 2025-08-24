import { z } from "zod";
import { AuthFormState } from "@/types/auth";

// Recursive function: walk through the tree from treeifyError
function flattenTreeErrors(
    tree: unknown,
    parentKey = ""
): Record<string, string[]> {
    const flat: Record<string, string[]> = {};

    // Strategi early return untuk kasus-kasus dasar
    if (!tree || typeof tree !== "object") {
        return flat;
    }

    if (Array.isArray(tree)) {
        if (tree.length > 0 && parentKey) {
            flat[parentKey] = tree as string[];
        }
        return flat;
    }

    // Menggunakan Object.entries() untuk memproses setiap entri
    Object.entries(tree).forEach(([key, value]) => {
        // Kasus spesial untuk error form-level
        if (key === "_errors" && parentKey) {
            flat[parentKey] = value as string[];
            return; // Selesai dengan entri ini, lanjut ke yang berikutnya
        }

        const nestedErrors = flattenTreeErrors(value, key);
        Object.assign(flat, nestedErrors);
    });

    return flat;
}

// General flatten zod errors tree
export function GenericFlattenErrors<T extends z.ZodTypeAny>(
    schema: T,
    error: z.ZodError<z.infer<T>>
): Record<string, string[]> {
    const tree = z.treeifyError(error);

    const flat: Record<string, string[]> = {};

    if (schema instanceof z.ZodObject) {
        for (const key of Object.keys(schema.shape)) {
            const val = (tree as any)[key];
            if (Array.isArray(val)) {
                flat[key] = val;
            }
        }
    }

    if (Array.isArray((tree as any)._errors)) {
        flat["_form"] = (tree as any)._errors;
    }

    return flat;
}

// Wrapper khusus untuk ZodError → AuthFormState["error"]
export function parsedErrorAuthFormState<T extends z.ZodTypeAny>(
    error: z.ZodError<z.infer<T>>
): AuthFormState["errors"] {
    const tree = z.treeifyError(error);
    return flattenTreeErrors(tree) as AuthFormState["errors"];
}