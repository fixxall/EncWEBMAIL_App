const getAccessToken = () => {
    const storedData = sessionStorage.getItem('access-token');
    return storedData;
};

const setAccessToken = (value: string) => {
    sessionStorage.setItem('access-token', value);
};

export {getAccessToken, setAccessToken}