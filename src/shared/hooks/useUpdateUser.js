import { useMutation } from "@tanstack/react-query";
import { post } from "../utils/metods";

const mainUrl = import.meta.env.VITE_MAIN_API;

export function useUpdateUser(payload) {
    return useMutation({
        mutationKey: ['user-update'],
        mutationFn: () => updateUser(payload)
    });
}

async function updateUser(payload) {
    return post(mainUrl + 'auth/me', payload);
}
