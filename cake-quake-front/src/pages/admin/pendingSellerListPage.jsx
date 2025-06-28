import { useSearchParams } from "react-router";
import { approvePendingSeller, getpendingSellerList, holdPendingSeller, rejectPendingSeller } from "../../api/adminApi";
import PendingSellerListComponent from "../../components/member/admin/pendingSellerListComponent";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "../../components/common/loadingSpinner";
import { useEffect, useRef, useState } from "react";
import ResultModal from "../../components/common/resultModal";


const PendingSellerListPage = () => {

    const [searchParams, setSearchParams] = useSearchParams()
    const currentPage = parseInt(searchParams.get('page')) || 1
    const size = parseInt(searchParams.get('size')) || 10
    // 검색 처리 추가 필요(type, keyword로 사용 가능)
    const [selectedType, setSelectedType] = useState(null)
    const [searchKeyword, setSearchKeyword] = useState(null)
    const [appliedKeyword, setAppliedKeyword] = useState(null) // 버튼 누를 때만 갱신

    useEffect(() => {
        setSearchParams({ page: 1, size: size }) // 새로 고침 시 페이지를 1로 설정
    }, [])

    const queryClient = useQueryClient()

    // 상태별 리스트 분류용
    const [statusFilter, setStatusFilter] = useState("ALL")
    // 결과 모달 창
    const [showModal, setShowModal] = useState(false)
    const [modalMsg, setModalMsg] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    // useInfiniteQuery: 여러 페이지 데이터를 자동으로 계속 가져오게 해줌.
    const query = useInfiniteQuery({
        queryKey: ['pendingSellerList', statusFilter, appliedKeyword],
        queryFn: async ({ pageParam = 1 }) => {
            // api 호출
            const res = await getpendingSellerList(pageParam, size, statusFilter, selectedType, searchKeyword)
            return res.data
        },
        // 다음 페이지가 있다면 다음 번호 계산
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.hasNext ? allPages.length + 1 : undefined
        },
        staleTime: 10 * 60 * 1000,
        retry: false,
    })

    // 검색 타입 변경 핸들러
    const handleTypeChange = (event) => {
        setSelectedType(event.target.value === "N" ? null : event.target.value)
    }

    // 검색 키워드 변경 핸들러
    const handleKeywordChange = (event) => {
        setSearchKeyword(event.target.value || null)
    }

    // 검색 실행 핸들러
    const handleSearch = () => {

        if (!searchKeyword || searchKeyword.trim() === "") {
            setErrorMessage("검색어를 입력해주세요.");
            return;
        }
        setErrorMessage(""); // 에러 초기화

        setAppliedKeyword(searchKeyword)
        const newParams = {
            page: 1,
            size: size,
        }

        if (searchKeyword) newParams.keyword = searchKeyword
        if (selectedType) newParams.type = selectedType

        setSearchParams(newParams);
    }
    
    const { data, isFetching, error, fetchNextPage, hasNextPage, isFetchingNextPage } = query
    
    // 전체 목록
    const allData = data?.pages.flatMap(page => page.content) || []

    // 필터링 (PENDING 등)
    const filteredData = statusFilter === "ALL"
        ? allData
        : allData.filter(item => item.status === statusFilter)

    const observerTargetRef = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            // 사용자가 스크롤을 내려서 div에 도달했는지 확인.
            if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage(); // 다음 페이지 불러오기

                // 페이지 번호 증가
                const newPage = currentPage + 1
                // 조건적으로 쿼리스트링 생성
                const newParams = {
                    page: newPage,
                    size: size,
                }

                if (appliedKeyword) newParams.keyword = appliedKeyword
                if (selectedType) newParams.type = selectedType

                setSearchParams(newParams) // URL 업데이트
            } // end if
        })

        // DOM 요소가 스크롤 뷰포트에 보이는지 감시 시작
        if (observerTargetRef.current) {
            observer.observe(observerTargetRef.current)
        }

        // 감시 중단
        return () => {
            if (observerTargetRef.current) {
                observer.unobserve(observerTargetRef.current)
            }
        }
    }, [fetchNextPage, hasNextPage, isFetchingNextPage, currentPage, size, setSearchParams])

    // 승인 mutation
    const approveMutation = useMutation({
        mutationFn: approvePendingSeller,
        onSuccess: (res) => {
            setModalMsg(res.message)
            setShowModal(true)

            // 자동 닫기 (2초 후)
            setTimeout(() => {
                setShowModal(false)
            }, 2000)
            // 목록 새로고침
            queryClient.invalidateQueries(['pendingSellerList', statusFilter])
        },
        onError: (err) => {
            const msg = err?.response?.data?.message || "판매자로 승인 처리 중 오류가 발생했습니다."
            setErrorMessage(msg)
            console.error("승인 오류:", err)
        }
    })

    // 승인 버튼 클릭 핸들러
    const handleApprove = (tempSellerId) => {
        approveMutation.mutate(tempSellerId)
    }
    
    // 보류 mutation
    const holdMutation = useMutation({
        mutationFn: holdPendingSeller,
        onSuccess: (res) => {
            setModalMsg(res.message)
            setShowModal(true)
            
            // 자동 닫기 (2초 후)
            setTimeout(() => {
                setShowModal(false)
            }, 2000)
            // 목록 새로고침
            queryClient.invalidateQueries(['pendingSellerList', statusFilter])
        },
        onError: (err) => {
            let msg = err?.response?.data?.message || "대기자 보류 처리 중 오류가 발생했습니다."

            if (msg === "요청 상태를 해당 값으로 변경할 수 없습니다.") {
                msg = "이미 승인된 판매자입니다."
            }

            setErrorMessage(msg)
            console.error("보류 처리 오류:", err)
        }
    })
    
    // 보류 버튼
    const handleHold = (tempSellerId) => {
        holdMutation.mutate(tempSellerId)
    }

    // 거절 mutation
    const rejectMutation = useMutation({
        mutationFn: rejectPendingSeller,
        onSuccess: (res) => {
            setModalMsg(res.message)
            setShowModal(true)
            
            // 자동 닫기 (2초 후)
            setTimeout(() => {
                setShowModal(false)
            }, 2000)
            // 목록 새로고침
            queryClient.invalidateQueries(['pendingSellerList', statusFilter])
        },
        onError: (err) => {
            let msg = err?.response?.data?.message || "대기자 거절 처리 중 오류가 발생했습니다."

            if (msg === "요청 상태를 해당 값으로 변경할 수 없습니다.") {
                msg = "이미 승인된 판매자입니다."
            }

            setErrorMessage(msg)
            console.error("거절 처리 오류:", err)
        }
    })
    
    // 거절 버튼
    const handleReject = (tempSellerId) => {
        rejectMutation.mutate(tempSellerId)
    }

    const closeResultModal = () => {
        setShowModal(false)
    }

    return (
        <div>
            {isFetching && <LoadingSpinner />} {/* 로딩 스피너 */}
            {error && <div className="text-red-500">오류 발생: {error.message}</div>} {/* 오류 메시지 */}
            {!isFetching && !error && data && (
                <PendingSellerListComponent
                    data={data}
                    isFetching={isFetching}
                    errorMessage={errorMessage}
                    handleApprove={handleApprove}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    filteredData={filteredData}
                    handleHold={handleHold}
                    handleReject={handleReject}
                    isFetchingNextPage={isFetchingNextPage}
                    observerTargetRef={observerTargetRef}
                    handleTypeChange={handleTypeChange}
                    handleKeywordChange={handleKeywordChange}
                    handleSearch={handleSearch}
                    selectedType={selectedType}
                    searchKeyword={searchKeyword}
                />
            )}
            <ResultModal show={showModal} closeResultModal={closeResultModal} msg={modalMsg} />
        </div>
    )
}

export default PendingSellerListPage;