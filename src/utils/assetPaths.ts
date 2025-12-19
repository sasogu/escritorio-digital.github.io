const baseUrl = import.meta.env.BASE_URL ?? '/';

export const withBaseUrl = (path: string): string => {
    if (!path) {
        return baseUrl;
    }

    const normalized = path.startsWith('/') ? path.slice(1) : path;
    return `${baseUrl}${normalized}`;
};
