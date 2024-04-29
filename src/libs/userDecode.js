import { jwtDecode } from "jwt-decode";
import { getUuid } from "./localStrage";
const userDecode = () => {
    try {
        const token = getUuid();
        if (!token) { return; }
        return jwtDecode(token);
    }
    catch (e) {
        console.error("Err while decode user token: ", e)
    }
}
export default userDecode;