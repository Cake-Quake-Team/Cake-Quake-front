import React from 'react';
import PropTypes from 'prop-types'; // PropTypes를 임포트하여 타입 검사 추가

function BadgeCard({ badge, isAcquiredView, onSetProfileBadge }) {
    const badgeId = badge.badgeId;
    const icon = badge.icon; // 백엔드에서 받은 'icon' 필드 사용
    const description = badge.description;
    const acquiredDate = badge.acquiredDate;
    const name = isAcquiredView ? badge.name : badge.name; // DTO에 따라 필드명 다름
    const acquired = isAcquiredView ? true : badge.acquired; // isAcquiredView면 항상 획득으로 간주
    const isRepresentative = isAcquiredView ? badge.isRepresentative : false;

    const handleSetRepresentative = () => {
        if (onSetProfileBadge) {
            onSetProfileBadge(badgeId);
        }
    };

    // CSS 클래스를 동적으로 생성
    const cardClasses = `badge 
                         ${acquired ? 'acquired' : 'unacquired'} 
                         ${isRepresentative ? 'representative' : ''}`;

    return (
        <div className={cardClasses}>
            <span
                className="badge-icon"
            >
                {icon || '❓'}
            </span>

            <div className="badge-name">{name}</div>
            <div className="badge-desc">{description}</div>

            {acquired ? (
                <>
                    <p style={{ color: '#4CAF50', fontWeight: 'bold' }}>획득!</p>
                    {acquiredDate && (
                        <p style={{ fontSize: '0.8em', color: '#777' }}>
                            획득일: {new Date(acquiredDate).toLocaleDateString('ko-KR')}
                        </p>
                    )}

                    {isAcquiredView && (
                        <>
                            {isRepresentative && (
                                <p style={{ fontWeight: 'bold', color: 'gold', marginTop: '5px' }}>대표 뱃지</p>
                            )}
                            {/* isRepresentative가 아니고, onSetProfileBadge 함수가 전달되었을 때만 버튼 표시 */}
                            {!isRepresentative && onSetProfileBadge && (
                                <button onClick={handleSetRepresentative} className="badge-button">
                                    대표 뱃지로 설정
                                </button>
                            )}
                        </>
                    )}
                </>
            ) : (
                <p style={{ color: '#999' }}>미획득</p>
            )}
        </div>
    );
}

// PropTypes를 사용하여 props의 타입을 명시하고 검사합니다.
BadgeCard.propTypes = {
    badge: PropTypes.shape({
        badgeId: PropTypes.number.isRequired,
        icon: PropTypes.string, // 이모티콘 문자열 (필수 여부는 DB 스키마에 따라 다름)
        description: PropTypes.string,
        acquiredDate: PropTypes.string, // 날짜 문자열
        badgeName: PropTypes.string, // MemberBadgeDTO용
        name: PropTypes.string,      // AcquiredBadgeDTO용
        acquired: PropTypes.bool,
        isRepresentative: PropTypes.bool,
    }).isRequired,
    isAcquiredView: PropTypes.bool.isRequired,
    onSetProfileBadge: PropTypes.func, // 대표 뱃지 설정 함수 (있을 수도 있고 없을 수도 있음)
};

export default BadgeCard;