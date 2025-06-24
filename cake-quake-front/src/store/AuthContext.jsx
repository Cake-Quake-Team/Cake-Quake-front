import { createContext, useContext, useEffect, useState } from "react";
import { getCookie, setCookie } from "../utils/cookieUtil";
import { parseJwt } from "../utils/parseJwt";

/*
    전역 로그인, 로그아웃 처리
*/
const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    
    const [user, setUser] = useState(null)

    useEffect(() => {
        try {
            const token = getCookie("access_token")

            if (!token) {
                setUser(null)
                return
            }

            const payload = parseJwt(token)

            if (payload?.userId && payload?.uname && payload?.role) {
                // shopId가 있는 경우에만 setUser 호출
                if (payload.role === "SELLER" && payload.shopId) {
                    setUser({ shopId: payload.shopId, userId: payload.userId, uname: payload.uname, role: payload.role })
                } else if (payload.role === "ADMIN") {
                    setUser({ userId: payload.userId, uname: payload.uname, role: payload.role })
                } else if (payload.role === "BUYER") {
                    setUser({ userId: payload.userId, uname: payload.uname, role: payload.role })
                } else {
                    // 역할이 정의되지 않았거나 shopId가 없는 경우 처리
                    setErrorMessage('판매자 정보가 올바르지 않습니다.') // 예외 메시지
                    return
                }
            }
        } catch (error) {
            console.error("토큰 파싱 중 오류 발생:")
            setUser(null)
        }
    }, [])

    // 로그아웃 쿠키 삭제
    const signOut = async () => {
        setUser(null) // 상태 초기화
        setCookie('access_token', "", 0)
        setCookie('refresh_token', "", 0)
    }

    return (
        <AuthContext.Provider value={{ user, setUser, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}


export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth가 AuthProvider로 감싸지지 않은 컴포넌트 안에서 사용됨")
    }
    return context;
}