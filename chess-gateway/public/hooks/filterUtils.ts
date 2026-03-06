
// Utility to normalize filters between client and server formats
export const normalizeFilter = (filter: any[]): any[] => {
    if (!filter || !Array.isArray(filter)) return [];

    return filter.map(item => ({
        key: item.key,
        term: item.term || item.value,
        type: item.type
    }));
};

// Utility to create a filter with the correct structure
export const createFilter = (key: string, term: string, type: string = "SELECT") => {
    return [{ key, term, type }];
};