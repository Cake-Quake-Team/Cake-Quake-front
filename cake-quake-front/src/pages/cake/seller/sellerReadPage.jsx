import { useEffect, useState } from "react";
import { getCakeDetail, deleteCake } from "../../../api/cakeApi.jsx";
import { List } from "lucide-react";
import CakeDetailComponent from "../../../components/cake/itemComponents/cakeDetailComponent.jsx";
import { Link, useNavigate, useParams } from "react-router";
import CakeOptionList from "../../../components/cake/optionComponents/optionListComponent.jsx";
import { useAuth } from "../../../store/AuthContext.jsx";
import AlertModal from "../../../components/common/AlertModal";

function SellerCakeReadPage() {
    const { user } = useAuth();
    const { cakeId } = useParams();
    const navigate = useNavigate();
    const [cake, setCake] = useState(null);
    const [optionTypes, setOptionTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const S3_BASE_URL = import.meta.env.VITE_S3_BASE_URL;
    const [formError, setFormError] = useState(null);
    const [showError, setShowError] = useState(false);

    const fetchCakeDetail = async () => {
        if (!cakeId) {
            setError("케이크 ID가 제공되지 않았습니다.");
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError(null);

            const data = await getCakeDetail(user.shopId, cakeId);
            setCake(data);

            if (data && data.options) {
                const groupedOptions = data.options.reduce((acc, currentOption) => {
                    const typeId = currentOption.optionTypeId;
                    const typeName = currentOption.optionTypeName || `알 수 없는 옵션 타입 ${typeId}`;

                    if (!acc[typeId]) {
                        acc[typeId] = {
                            optionTypeId: typeId,
                            optionType: typeName,
                            isRequired: currentOption.isRequired,
                            minSelection: currentOption.minSelection,
                            maxSelection: currentOption.maxSelection,
                            optionItems: []
                        };
                    }
                    acc[typeId].optionItems.push({
                        optionItemId: currentOption.optionItemId,
                        optionName: currentOption.optionName,
                        price: currentOption.price
                    });
                    return acc;
                }, {});

                setOptionTypes(Object.values(groupedOptions));
            } else {
                setOptionTypes([]);
            }

        } catch (err) {
            console.error("케이크 상세 정보를 불러오는 데 실패했습니다:", err);
            setError("케이크 상세 정보를 불러오는 데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const isFromUpdate = location.state?.fromUpdate || false;
        fetchCakeDetail(isFromUpdate);

        if (isFromUpdate) {
            window.history.replaceState({}, document.title);
        }
    }, [cakeId, location.pathname]);

    useEffect(() => {
        const handleFocus = () => {
            fetchCakeDetail(true);
        };
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [cakeId]);

    const handleDelete = async () => {
        if (window.confirm("정말로 이 상품을 삭제하시겠습니까?")) {
            try {
                await deleteCake(cakeId);
                setFormError({message: "상품이 삭제되었습니다.", type: 'success' });
                setShowError(true);
                navigate(`/shops/${user.shopId}`);
            } catch (err) {
                console.error("상품 삭제 실패:", err);
                setFormError({message: "상품 삭제에 실패했습니다.", type: 'error' });
                setShowError(true);
            }
        }
    };

    // formError 알림 자동 사라짐
    useEffect(() => {
        if (showError) {
            const timer = setTimeout(() => setShowError(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showError]);

    if (loading) {
        return (
            <div className="text-center py-8 text-gray-500">
                상품 정보를 불러오는 중...
            </div>
        );
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">{error}</div>;
    }

    return (
        <div>
            <div className="container mx-auto px-6 py-10">
                <div className="flex items-center justify-center relative mb-3">
                    {user.shopId && (
                        <Link
                            to={`/shops/${user.shopId}`}
                            className="absolute left-0 top-1/2 -translate-y-1/2 px-4 py-2 rounded-md hover:text-gray-500 transition-colors duration-200"
                            title="목록으로"
                        >
                            <List size={30} />
                        </Link>
                    )}

                    <h1 className="text-2xl font-semibold">상품 상세 조회</h1>
                </div>
                <hr className="mb-6 w-1/4 mx-auto" />

                <CakeDetailComponent
                    cake={cake}
                    optionTypes={optionTypes}
                    selectedOptions={selectedOptions}
                    setSelectedOptions={setSelectedOptions}
                    apiBaseUrl={S3_BASE_URL}
                    OptionComponent={CakeOptionList}
                    // formError prop 제거
                />

                <div className="mt-6 flex justify-center">
                    <button
                        onClick={handleDelete}
                        className="border border-gray-400 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
                    >
                        삭제
                    </button>
                    {user.shopId && (
                        <Link
                            to={`/shops/${user.shopId}/cakes/update/${cakeId}`}
                            className="ml-5 bg-black text-white px-4 py-2 rounded hover:bg-gray-500"
                        >
                            수정
                        </Link>
                    )}
                </div>
            </div>

            <AlertModal
                message={formError}
                type="error" // 필요에 따라 성공/에러 구분 가능
                show={showError}
                onClose={() => setShowError(false)}
            />
        </div>
    );
}

export default SellerCakeReadPage;
