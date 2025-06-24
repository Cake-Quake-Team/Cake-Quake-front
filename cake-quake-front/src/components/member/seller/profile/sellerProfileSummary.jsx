import {useNavigate} from "react-router";
import {useEffect, useState} from "react";
import {useAuth} from "../../../../store/AuthContext.jsx";


const SellerProfileSummary = () => {
    const navigate = useNavigate();
    const [memberProfile, setMemberProfile] = useState(null); // 판매자(Member) 프로필 정보를 위한 상태
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, setUser } = useAuth();

    useEffect(() => {
        const fetchMemberProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                // 현재 로그인한 사용자의 프로필 정보를 가져오는 API 호출
                // const response = await jwtAxios.get(`${MEMBER_API_PREFIX}/my-profile`);
                // setMemberProfile(response.data); // 예: { memberId, name, profileImageUrl, ... }
            } catch (err) {
                console.error("판매자 프로필 정보를 불러오는 데 실패했습니다:", err);
                setError("프로필 정보를 불러올 수 없습니다.");
                setMemberProfile(null);
            } finally {
                setLoading(false);
            }
        };

        fetchMemberProfile();
    }, []);

    const handleDetailProfile = () => {
        navigate('/seller/profile/detail'); //판매자 계정 정보 조회 페이지 이동
    };

    if (loading) {
        return (
            <div className="flex items-center p-4 bg-white rounded-xl shadow-md border border-gray-100 min-h-[100px] justify-center text-gray-500">
                <p>판매자 프로필 정보를 불러오는 중...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center p-4 bg-white rounded-xl shadow-md border border-gray-100 min-h-[100px] justify-center text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    if (!memberProfile) {
        return (
            <div className="flex items-center p-4 bg-white rounded-xl shadow-md border border-gray-100 min-h-[100px] justify-center text-gray-500">
                <p>판매자 프로필 정보를 찾을 수 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="flex items-center p-4 bg-white rounded-xl shadow-md border border-gray-100">
    

            {/* 판매자 이름 및 역할 */}
            <div className="flex-grow">
                <h3 className="text-xl font-bold text-gray-900">{user.name || '알 수 없는 판매자'}</h3>
                <p className="text-sm text-gray-600">판매자</p>
            </div>

            {/* 정보 수정 버튼 */}
            <button
                onClick={handleDetailProfile}
                className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors duration-200 ml-4 flex-shrink-0"
            >
                <Settings className="w-6 h-6 mb-1" />
                <span className="text-xs font-semibold">정보 조회</span>
            </button>
        </div>
    );
};
export default SellerProfileSummary;