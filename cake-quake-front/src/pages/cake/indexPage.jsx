import {Link, Outlet} from "react-router";

export default function CakeIndex() {
    return (
        <div style={{ padding: "1rem" }}>
            <h2>🎂 케이크 메인 페이지</h2>
            <p>원하는 작업을 선택하세요:</p>

            <ul>
                <li>
                    <Link to="list">케이크 목록 보기</Link>
                </li>
                <li>
                    <Link to="add">새 케이크 등록</Link>
                </li>
            </ul>

            <hr />

            {/* 하위 라우트를 이 안에서 렌더링 */}
            <Outlet />
        </div>
    );
}