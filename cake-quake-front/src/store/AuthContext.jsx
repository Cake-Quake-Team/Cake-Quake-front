import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getSigninUserInfo, postSignout } from "../api/authApi";
// import { getCookie, setCookie } from "../utils/cookieUtil";
// import { parseJwt } from "../utils/parseJwt";

/*
    전역 로그인, 로그아웃 처리

    25.07.02 수정: 리액트 쿠키에서 HTTPOnly 쿠키로 변경하면서 토큰 확인이 없어짐. user 정보는 백 서버에서 받아옴.
    토큰파싱했던 정보는 동일하게 받아와서, 그대로 사용할 수 있음.

*/
const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    
    const [user, setUser] = useState(null)

    // useEffect(() => {
    //     try {
    //         const token = getCookie("access_token")

    //         if (!token) {
    //             setUser(null)
    //             return
    //         }

    //         const payload = parseJwt(token)
    //         console.log("AuthContext --- uid: ", payload.uid)

    //         if (payload?.uid && payload?.userId && payload?.uname && payload?.role) {
    //             // shopId가 있는 경우에만 setUser 호출
    //             if (payload.role === "SELLER" && payload.shopId) {
    //                 setUser({ shopId: payload.shopId, uid: payload.uid, userId: payload.userId, uname: payload.uname, role: payload.role })
    //             } else if (payload.role === "ADMIN") {
    //                 setUser({ uid: payload.uid, userId: payload.userId, uname: payload.uname, role: payload.role })
    //             } else if (payload.role === "BUYER") {
    //                 setUser({ uid: payload.uid, userId: payload.userId, uname: payload.uname, role: payload.role })
    //             } else {
    //                 // 역할이 정의되지 않았거나 shopId가 없는 경우 처리
    //                 setErrorMessage('판매자 정보가 올바르지 않습니다.') // 예외 메시지
    //                 return
    //             }
    //         } // end if
    //     } catch (error) {
    //         console.error("토큰 파싱 중 오류 발생:")
    //         setUser(null)
    //     }
    // }, [])
    // useEffect(() => {
    //         // 유저 정보 조회 
    //         const fetchUserInfo = async () => {
    //             try {
    //                 // 유저 정보가 있으면 / 없으면
    //                 const res = await getSigninUserInfo()
    //                 console.log("---fetchUserInfo---res: ", res)
    
    //                 setUser(res)
    //             } catch (err) {
    //                 console.error("사용자 정보 조회 실패", err)
    //                 setUser(null)
    //                 return
    //             }
    //         }
    //         fetchUserInfo()

    // }, [])

    // // 중복 호출 방지
    // const didFetchRef = useRef(false)
    //
    // useEffect(() => {
    //
    //     if (!user == null && !didFetchRef.current) {
    //         didFetchRef.current = true;
    //         const fetchUserInfo = async () => {
    //             try {
    //                 const res = await getSigninUserInfo()
    //                 setUser(res)
    //             } catch (err) {
    //                 console.error("사용자 정보 조회 실패", err)
    //                 setUser(null)
    //             }
    //         }
    //         fetchUserInfo()
    //     }
    // }, [user])
    const [isLoading, setIsLoading] = useState(true); // 사용자 정보 로딩 상태

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                // 백엔드 /api/v1/member/info 또는 유사한 엔드포인트 호출
                // 이 요청은 브라우저에 저장된 httponly 쿠키(accessToken)를 자동으로 포함하여 보냄
                const res = await getSigninUserInfo();
                // getSigninUserInfo의 응답 데이터 구조에 따라 setUser를 조정해야 함
                // 예: 백엔드가 { data: { uid: ..., userId: ..., uname: ..., role: ..., shopId: ... } } 반환 시
                setUser(res); // 백엔드에서 반환된 사용자 정보를 그대로 user 상태에 설정
            } catch (err) {
                console.error("사용자 정보 조회 실패:", err);
                setUser(null); // 에러 발생 시 user 상태 초기화 (로그아웃 상태로 간주)
                // 선택: 사용자 정보 로딩 실패 시 로그인 페이지로 강제 리다이렉트
                // if (location.pathname !== '/auth/signin' && location.pathname !== '/') {
                //    window.location.replace('/auth/signin');
                // }
            } finally {
                setIsLoading(false); // 로딩 완료
            }
        };

        fetchUserInfo();
    }, []); // 빈 배열: 컴포넌트가 처음 마운트될 때 단 한 번만 실행

    // useEffect(() => {
    //     if(user == null && !didFetchRef.current) {
    //         didFetchRef.current = true
    //         const fetchUserInfo = async () => {
    //             try {
    //                 // 성공하면 authApi로 분리
    //                 const res = await getSigninUserInfo()
    //                 console.log("---fetchUserInfo---res: ", res)
    
    //                 setUser(res)
    //             } catch (err) {
    //                 console.error("사용자 정보 조회 실패", err)
    //                 setUser(null)

    //                 const allowedPaths = ["/auth/signin", "/", "/auth/kakao", "/auth/signup", ]
    //                 if (!allowedPaths.includes(location.pathname)) {
    //                     window.location.replace("/auth/signin")
    //                 }
    //             }
                
    //         }
    //         fetchUserInfo()
    //     }

    // }, [user])

    // 로그아웃 쿠키 삭제
    const signOut = async () => {
        setUser(null) // 상태 초기화
        await postSignout()
        
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