// 예시용 케이크 데이터 (실제 앱에서는 API 호출로 대체)
import {Link} from "react-router";

const dummyCakes = [
    { id: 1, name: "초코 케이크", description: "진한 초콜릿 풍미" },
    { id: 2, name: "딸기 케이크", description: "상큼한 생딸기와 부드러운 크림" },
    { id: 3, name: "치즈 케이크", description: "꾸덕하고 고소한 치즈" },
];

export default function CakeList() {
    return (
        <div style={{ padding: "1rem" }}>
            <h2>🍰 케이크 목록</h2>
            <ul>
                {dummyCakes.map((cake) => (
                    <li key={cake.id} style={{ marginBottom: "1rem" }}>
                        <strong>{cake.name}</strong>
                        <p>{cake.description}</p>
                        <Link to={`/cake/read/${cake.id}`}>자세히 보기</Link>
                    </li>
                ))}
            </ul>

            <Link to="/cake/add">➕ 새 케이크 등록하기</Link>
        </div>
    );
}