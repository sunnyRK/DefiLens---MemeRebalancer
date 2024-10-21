const getBaseURL = (NODE_ENV: string | undefined) => {
    return 'https://api.coingecko.com/api/api';
};

export const BASE_URL = getBaseURL("dev");