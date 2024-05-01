const getUuid = () => {
    const token = localStorage.getItem('uuid');
    if (!token) { return }
    return localStorage.getItem('uuid');
}

const setUserUuid = (r_token) => {
    localStorage.setItem('uuid', r_token);
}

const getSidebarSetting = () => {
    const setting = localStorage.getItem('sidebar');
    if (setting === 'true') {
        return true
    }
    return false;
}

const setSidebarSetting = (val) => {
    localStorage.setItem('sidebar', val);
}

export { getUuid, setUserUuid, getSidebarSetting, setSidebarSetting };
