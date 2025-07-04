import React from 'react';

/**
 * 관리자용 QnA 상세 컴포넌트
 */
export function QnAAdminDetail({ qna }) {
    if (!qna) return null;

    return (
        <div className="space-y-6 bg-white p-6 rounded shadow">
            {/* 기본 정보 */}
            <section className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">문의 ID: {qna.qnaId}</h2>
                <span className="px-2 py-1 bg-gray-200 rounded text-sm">
          {qna.status}
        </span>
            </section>

            {/* 작성자·메타 */}
            <section className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                    <p><strong>작성자 ID:</strong> {qna.memberId}</p>
                    <p><strong>유형:</strong> {qna.qnAType}</p>
                </div>
                <div>
                    <p><strong>등록:</strong> {new Date(qna.regDate).toLocaleString()}</p>
                    <p><strong>수정:</strong> {new Date(qna.modDate).toLocaleString()}</p>
                </div>
            </section>

            {/* 제목 */}
            <section>
                <h3 className="font-medium">제목</h3>
                <p className="mt-1">{qna.title}</p>
            </section>

            {/* 내용 */}
            <section>
                <h3 className="font-medium">내용</h3>
                <p className="mt-1 whitespace-pre-wrap">{qna.content}</p>
            </section>

            {/* 관리자 답변 */}
            <section>
                <h3 className="font-medium">관리자 답변</h3>
                <p className="mt-1 whitespace-pre-wrap">
                    {qna.adminResponse || '아직 등록된 답변이 없습니다.'}
                </p>
            </section>
        </div>
    );
}
