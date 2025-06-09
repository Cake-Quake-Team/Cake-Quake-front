import { Navigate, Outlet } from "react-router";
import {getCookie} from "../../utils/cookieUtil";
import { parseJwt } from "../../utils/parseJwt";

// 토큰이 없으면 로그인 페이지로 이동
const RequireAuth = ({ allowedRoles }) => {
    const token = getCookie("access_token")
    const user = parseJwt(token)
    console.log(user.role)

    if (!token || (allowedRoles && !allowedRoles.includes(user.role))) {
    return <Navigate to="/auth/signin" replace />;
  }

  return <Outlet />;
}

export default RequireAuth;