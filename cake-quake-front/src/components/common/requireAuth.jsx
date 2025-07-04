import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../store/AuthContext";


/*
    25.07.02 리액트 쿠키에서 HTTPOnly 쿠키로 변경하면서 토큰 확인이 없어짐. 대신 컨텍스트에서 관리하는 user 정보를 이용.
    라우터에 롤로 제한 걸 수 있는 함수
*/
const RequireAuth = ({ allowedRoles }) => {
//     const token = getCookie("access_token")
//     // 1. 토큰이 없으면 로그인 화면으로
//     if (!token) {
//         return <Navigate to="/auth/signin" replace />;
//     }

//     // 2. 토큰이 있어도 파싱 실패하거나 user 정보 없으면 로그인 화면으로
//     const user = parseJwt(token)
//     if (!user || !user.role) {
//         return <Navigate to="/auth/signin" replace />;
//     }
//     console.log(user.role)

//     // 3. 권한이 허용되지 않으면 로그인 화면으로
//     if (allowedRoles && !allowedRoles.includes(user.role)) {
//         return <Navigate to="/auth/signin" replace />;
//     }

//   return <Outlet />;
    const { user } = useAuth()

    console.log("---RequireAuth---user: ", user)
    // 아직 사용자 정보 로딩 중일 수 있으므로 null 체크
    if (user === null) {
        return <Navigate to="/auth/signin" replace />
    }

    if (!user || !user.role) {
        return <Navigate to="/auth/signin" replace />
    }

    // 3. 권한이 허용되지 않으면 로그인 화면으로
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/auth/signin" replace />
    }

    return <Outlet />
}

export default RequireAuth;