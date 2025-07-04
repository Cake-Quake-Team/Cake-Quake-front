import React, { useEffect, useState } from 'react';
import { getMemberBadges, getAllBadgesWithAcquisitionStatus, setProfileBadge } from '../../../api/badgeApi';
import BadgeCard from '../../../components/badge/BadgeCard'; // BadgeCard 컴포넌트 임포트 경로 확인
import { useAuth } from "../../../store/AuthContext.jsx"; // 사용자 인증 정보 임포트 경로 확인

// 필요한 경우 CSS 파일을 임포트합니다. (예: './buyerBadges.css')
// import './buyerBadges.css';

function BadgesPage() {
    const [viewMode, setViewMode] = useState('acquired'); // 현재 뷰 모드: 'acquired' (획득한 뱃지) 또는 'all' (모든 뱃지)
    const [badges, setBadges] = useState([]); // 현재 뷰 모드에 따라 표시될 뱃지 데이터
    const [loading, setLoading] = useState(true); // 데이터 로딩 상태
    const [error, setError] = useState(null); // 에러 상태
    const { user } = useAuth(); // 인증 컨텍스트에서 사용자 정보 가져오기
    const uid = user?.uid; // 사용자 UID (없을 경우 undefined)

    // 뱃지 데이터를 백엔드에서 가져오는 비동기 함수
    const fetchData = async () => {
        setLoading(true); // 로딩 시작
        setError(null); // 에러 초기화
        try {
            // 사용자 정보가 없으면 데이터 로드를 중단
            if (!user || !uid) {
                // 사용자 정보가 없으면 로딩 상태만 해제하고, '사용자 정보를 불러오는 중...' 메시지가 계속 표시되도록 합니다.
                // 또는 명확한 오류 메시지를 설정할 수 있습니다.
                setLoading(false);
                setError('사용자 정보를 불러올 수 없습니다. 로그인 상태를 확인해주세요.');
                return;
            }

            let data;
            // 현재 viewMode에 따라 다른 API 호출
            if (viewMode === 'acquired') {
                // MemberBadgeDTO를 반환
                data = await getMemberBadges(uid); // 획득한 뱃지 목록 가져오기
            } else { // viewMode === 'all'
                // AcquiredBadgeDTO를 반환
                data = await getAllBadgesWithAcquisitionStatus(uid); // 모든 뱃지 (획득 여부 포함) 목록 가져오기
            }
            setBadges(data); // 가져온 데이터로 뱃지 상태 업데이트
        } catch (err) {
            console.error('데이터 로딩 실패:', err);
            setError('뱃지 목록을 불러오는데 실패했습니다.'); // 사용자에게 표시할 에러 메시지
        } finally {
            setLoading(false); // 로딩 종료
        }
    };

    // 컴포넌트가 마운트되거나 uid, viewMode가 변경될 때마다 fetchData 함수 실행
    useEffect(() => {
        // user와 uid가 모두 유효할 때만 데이터 로드 시작
        if (user && uid) {
            fetchData();
        } else {
            // uid가 유효하지 않을 경우 로딩 상태만 해제하여 초기 메시지 표시
            setLoading(false);
        }
    }, [uid, viewMode, user]); // 의존성 배열: 이 값들이 변경될 때 useEffect 다시 실행

    // 대표 뱃지를 설정하는 비동기 함수
    const handleSetProfileBadge = async (badgeId) => {
        if (!user || !uid) {
            alert('사용자 정보가 없어 대표 뱃지를 설정할 수 없습니다.');
            return;
        }
        try {
            await setProfileBadge(uid, badgeId); // 백엔드 API 호출하여 대표 뱃지 설정
            alert('대표 뱃지가 성공적으로 설정되었습니다!');
            // 대표 뱃지 설정 후 변경된 데이터를 반영하기 위해 다시 데이터 불러오기
            // 특히 'acquired' 뷰에서 대표 뱃지 상태가 업데이트되어야 하므로 fetchData를 다시 호출
            await fetchData();
        } catch (err) {
            console.error('대표 뱃지 설정 실패:', err);
            let errorMessage = '대표 뱃지 설정에 실패했습니다.';
            // 에러 응답이 있다면 상세 메시지 표시
            if (err.response && err.response.data && err.response.data.message) {
                errorMessage = `대표 뱃지 설정 실패: ${err.response.data.data}`; // 백엔드 에러 메시지 필드 확인
            }
            alert(errorMessage);
        }
    };

    // 로딩 중이거나 에러 발생 시 표시할 UI
    if (!user) return <div style={{ textAlign: 'center', marginTop: '50px' }}>사용자 정보를 불러오는 중...</div>;
    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>뱃지 목록을 불러오는 중...</div>;
    if (error) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>오류: {error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>구매자 뱃지</h1> {/* H1 태그 내용을 좀 더 일반적인 '구매자 뱃지'로 변경하는게 좋을 것 같습니다. */}
            {/* 뷰 모드 전환 버튼 */}
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <button
                    onClick={() => setViewMode('acquired')}
                    className={`view-mode-button ${viewMode === 'acquired' ? 'active' : ''}`}
                    // 스타일을 CSS 파일로 옮기는 것을 권장합니다.
                    style={{ marginRight: '10px', padding: '10px 20px', border: '1px solid #ccc', borderRadius: '5px', cursor: 'pointer', backgroundColor: viewMode === 'acquired' ? '#007bff' : '#f0f0f0', color: viewMode === 'acquired' ? 'white' : 'black' }}
                >
                    획득한 뱃지
                </button>
                <button
                    onClick={() => setViewMode('all')}
                    className={`view-mode-button ${viewMode === 'all' ? 'active' : ''}`}
                    // 스타일을 CSS 파일로 옮기는 것을 권장합니다.
                    style={{ padding: '10px 20px', border: '1px solid #ccc', borderRadius: '5px', cursor: 'pointer', backgroundColor: viewMode === 'all' ? '#007bff' : '#f0f0f0', color: viewMode === 'all' ? 'white' : 'black' }}
                >
                    모든 뱃지
                </button>
            </div>

            {/* 뱃지 목록을 표시하는 그리드 컨테이너 */}
            <div className="badge-grid">
                {badges.length === 0 ? (
                    <div style={{textAlign: 'center', color: '#666', fontSize: '1.2em', width: '100%'}}>
                        {viewMode === 'acquired' ? '아직 획득한 뱃지가 없습니다.' : '등록된 뱃지가 없습니다.'}
                    </div>
                ) : (
                    badges.map((badge) => (
                        <BadgeCard
                            key={badge.memberBadgeId || badge.badgeId}
                            badge={badge}
                            isAcquiredView={viewMode === 'acquired'}
                            onSetProfileBadge={handleSetProfileBadge}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default BadgesPage;