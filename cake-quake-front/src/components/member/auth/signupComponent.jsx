import { Link } from "react-router";
import cakeImage from "../../../assets/signup_lettering_cake.jpg";

const SignupComponent = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-2xl flex flex-col items-center">
                <div className="flex flex-col md:flex-row items-center w-full mb-6">
                    {/* 이미지 */}
                    <img
                        src={cakeImage}
                        alt="레터링 케이크"
                        className="w-48 h-48 rounded-full object-cover mb-4 md:mb-0 md:mr-6"
                    />

                    {/* 텍스트 설명 */}
                    <div className="text-gray-700 text-sm leading-relaxed">
                        <p className="mb-1 font-semibold">자기만의 레터링 케이크 주문, 판매, 그리고 연결의 모든 것</p>
                        <p className="mb-2 font-bold text-lg text-rose-500">♥Cake Quake에서 시작해 보세요♥</p>
                        <p className="mb-1">Cake Quake는 케이크를 찾는 고객과 케이크를 만드는 판매자를 연결하는 온라인 플랫폼입니다.</p>
                        <p className="mb-1">맞춤형 주문부터 판매 관리까지, 누구나 쉽게 이용할 수 있도록 설계된 스마트한 시스템을 제공합니다.</p>
                        <p>지금 가입하고 케이크 비즈니스의 새로운 기회를 경험해 보세요.</p>
                    </div>
                </div>

                {/* 버튼 영역 */}
                <div className="w-full flex flex-col md:flex-row gap-4">
                    <Link
                        to="/auth/signup/buyer"
                        className="w-full text-center bg-rose-50 text-gray-700 py-2 rounded-lg hover:bg-rose-200 transition font-bold"
                    >
                        일반 회원 가입
                    </Link>
                    <Link
                        to="/auth/signup/seller-step1"
                        className="w-full text-center bg-rose-50 text-gray-700 py-2 rounded-lg hover:bg-rose-200 transition font-bold"
                    >
                        판매자 회원 가입
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignupComponent;
