import { useEffect, useState } from "react"
import { testAdminOnly, testSellerOnly, testToken } from "../../api/memberApi"

const TokenTestPage = () => {
    const [message, setMessage] = useState("")

    useEffect(() => {
        testToken() // api 서버 호출_쿠키에 저장한 토큰 이용
            .then((data) => {
                setMessage(data.message)
            })
            .catch((err) => {
                setMessage(err.message)
            })
    }, [])

    // useEffect(() => {
    //     testSellerOnly() // api 서버 호출_판매자만 접근 가능한지 확인
    //         .then((data) => {
    //             setMessage(data.message)
    //         })
    //         .catch((err) => {
    //             setMessage(err.message)
    //         })
    // }, [])

    // useEffect(() => {
    //     testAdminOnly() // api 서버 호출_관리자만 접근 가능한지 확인
    //         .then((data) => {
    //             setMessage(data.message)
    //         })
    //         .catch((err) => {
    //             setMessage(err.message)
    //         })
    // }, [])

    return (
        <div>
            <h2>토큰 테스트 결과</h2>
            <p>{message}</p>
        </div>
    )
}

export default TokenTestPage