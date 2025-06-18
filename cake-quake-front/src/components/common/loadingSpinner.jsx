/*
    form 제출 등 버튼 눌러서 api 호출할 때 로딩 기다리는 동안 보여줄 하늘색의 작고 동그란 스피너
*/
const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-4">
        <div className="h-6 w-6 border-2 border-t-transparent border-cyan-300 rounded-full animate-spin"></div>
    </div>
)

export default LoadingSpinner;