import { environment } from "@/configs/environment"

const API_URL = {
    login: '/api/auth/login',
    register: '/api/auth/register',
    getUsers: environment.NEXT_PUBLIC_BASE_URL + '/api/users'
}

export default API_URL