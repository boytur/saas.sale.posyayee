const getUuid = () => {
    const token = localStorage.getItem('uuid');
    if (!token) { return }
    return localStorage.getItem('uuid');
}

const setUserUuid = (r_token) => {
    localStorage.setItem('uuid', r_token);
}

export { getUuid, setUserUuid };
