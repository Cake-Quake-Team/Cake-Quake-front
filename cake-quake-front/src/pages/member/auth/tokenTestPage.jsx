import { useEffect, useState } from "react"
import { testToken } from "../../../api/authApi"

const TokenTestPage = () => {
    const [message, setMessage] = useState("")

    useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await testToken() // Axios 요청
        // console.log(res.data)
        setMessage(res.data.message)
      } catch (err) {
        console.error(err)
        setMessage(err.response?.data?.message || "에러가 발생했습니다.")
      }
    }

    fetchData()
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