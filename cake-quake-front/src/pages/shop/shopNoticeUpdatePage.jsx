import {useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {getShopNoticeDetail} from "../../api/shopApi.jsx";
import ShopNoticeForm from "../../components/shop/shopNoticeForm.jsx";

const ShopNoticeUpdatePage=()=>{
    //매장 ID(cid)와 공지사항 ID(nid) 가지고 옴
    const{cid:shopId,nid:noticeId}=useParams();
    const navigate= useNavigate();
    const[noticeDetail,setNoticeDetail]=useState(null); //불러온 공지사항 상세 데이터
    const[isLoading,setIsLoading]=useState(true); //데이터 로딩 상태
    const[error,setError]=useState(null); //에러 상태

    //마운트 시 기존 공지사항 데이터 불러옴
    useEffect(()=>{
        const fetchNoticeDetail=async ()=>{
            setIsLoading(true);
            setError(null);
            try{
                if(shopId&&noticeId){
                    const data=await getShopNoticeDetail(shopId,noticeId);
                    setNoticeDetail(data); //불러온 데이터 상태에 저장
                }else{
                    setError("유효하지 않은 공지사항 또는 매장정보 입니다.");
                }
            } catch (err) {
                console.error("공지사항 상세 불러오기 실패 :",err);
                setError("공지사항 상세 정보를 불러오는 데 실패했습니다.");
            } finally {
                setIsLoading(false);
            } //end finally
        };
        fetchNoticeDetail();
    },[shopId,noticeId]); //shopId,noticeId 변경될 때마다 실행

    //로딩, 에러 상태 처리
    if(isLoading){
        return(
            <div className="p-4 max-w-3xl mx-auto text-center text-gray-500">
                <p>공지사항 정보를 불러오는 중입니다...</p>
            </div>
        );
    } //end if

    if(error){
        return (
            <main className="flex-grow max-w-3xl w-full mx-auto px-4 py-8 md:px-0">
                <div className="text-center p-8 bg-red-100 text-red-700 rounded-lg shadow-md">
                    <p className="text-xl font-semibold mb-4">오류 발생</p>
                    <p>{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        이전 페이지로 돌아가기
                    </button>
                </div>
            </main>
        );
    } //end if

    //데이터 불러오기 성공 -> ShopNoticeForm 렌더링
    return(
        <ShopNoticeForm
            shopId={shopId}
            noticeId={noticeId}
            initialData={noticeDetail}
        />
    );

};

export default ShopNoticeUpdatePage;