import { Navigate, Outlet } from "react-router";
import {getCookie} from "../../utils/cookieUtil";
import { parseJwt } from "../../utils/parseJwt";

const RequireAuth = ({ allowedRoles }) => {
    const token = getCookie("access_token")
    // 1. 토큰이 없으면 로그인 화면으로
    if (!token) {
        return <Navigate to="/auth/signin" replace />;
    }

    // 2. 토큰이 있어도 파싱 실패하거나 user 정보 없으면 로그인 화면으로
    const user = parseJwt(token)
    if (!user || !user.role) {
        return <Navigate to="/auth/signin" replace />;
    }
    console.log(user.role)

    // 3. 권한이 허용되지 않으면 로그인 화면으로
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/auth/signin" replace />;
    }

  return <Outlet />;
}

export default RequireAuth;