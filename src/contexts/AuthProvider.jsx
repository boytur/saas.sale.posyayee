/* eslint-disable react/prop-types */
import { createContext, useContext, useMemo, useState, useEffect } from "react";
import Axios from "../libs/Axios";
import { setUserUuid } from "../libs/localStrage";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const res = await Axios.get("/api/auth/refresh");
                if (res.status === 200) {
                    setUser(res.data.user);
                    setAuthenticated(true);
                    setUserUuid(res.data.uuid)
                }
            } catch (error) {
                localStorage.clear();
                setAuthenticated(false);
                return;
            }
        };
        checkAuthStatus();
    }, []);

    const contextValue = useMemo(
        () => ({ user, authenticated }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [user]
    );

    //ให้ Provider component ทำหน้าที่ส่งค่า context ไปยัง child components
    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    );
};

//สร้าง custom hook เพื่อให้ง่ายต่อการใช้ context ใน components อื่น ๆ
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthContext);
};

//ส่งออก AuthProvider เป็น default
export default AuthProvider;