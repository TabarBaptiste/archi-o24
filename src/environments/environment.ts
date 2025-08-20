export const environment = {
    production: false,
    apiBase: 'https://restcountries.com/v3.1',
    apiLocal: 'http://localhost:3000/api'
};

export const END_POINTS = {
    auth: {
        register: `${environment.apiLocal}/auth/register`,
        login: `${environment.apiLocal}/auth/login`,
        logout: `${environment.apiLocal}/auth/logout`,
    },
    user: {
        profile: `${environment.apiLocal}/users/profile`
    }
};