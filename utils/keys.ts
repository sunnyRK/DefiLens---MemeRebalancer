const getBaseURL = (NODE_ENV: string | undefined) => {
    return process.env.API_URL;
};

export const BASE_URL = getBaseURL("dev");