import { useMutation } from "@tanstack/react-query";
import { get } from "../utils/metods";

const mainUrl = import.meta.env.VITE_MAIN_API;

export function useGetUser() {
    return useMutation({
        mutationKey: ['user'],
        mutationFn: () => getUser()
    });
}

async function getUser() {
    return get(mainUrl + 'auth/me');
}
