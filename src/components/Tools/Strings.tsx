export const isUpperCase = (s: string) => {
        return !/[a-z]/.test(s) && /[A-Z]/.test(s);
    }
