import React from 'react'; // React는 직접 사용되지 않을 수 있지만, 임포트는 유지 가능합니다.

export const getItemDetails = (item) => {
    let name = "알 수 없는 상품";
    let unitPrice = 0;
    let quantity = 0;
    let thumbnail = null;

    let selectedOptions = []; // 파싱된 옵션 상세 정보를 담을 배열
    let totalOptionsPrice = 0; // 옵션들의 총 가격
    let itemSubTotalPrice = 0; // 케이크 기본 가격 + 옵션 가격의 총 합

    if (item.cartItemId) { // 1. 장바구니 아이템인 경우
        name = item.cname;
        unitPrice = item.price;
        quantity = item.productCnt;
        thumbnail = item.thumbnailImageUrl;
        itemSubTotalPrice = item.itemTotalPrice || (unitPrice * quantity);

        if (item.selectedOptions && Array.isArray(item.selectedOptions)) {
            selectedOptions = item.selectedOptions;
            totalOptionsPrice = selectedOptions.reduce((sum, option) =>
                    sum + (option.price || 0) * (option.count || 1)
                , 0);
        } else {
            selectedOptions = []; // 옵션이 없거나 유효하지 않으면 빈 배열
        }

    } else if (item.cakeDetailDTO) { // 2. 직접 주문 상품 (상품 상세 페이지에서 바로 주문)
        name = item.cakeDetailDTO.cname;
        unitPrice = item.cakeDetailDTO.price;
        quantity = item.productCnt;
        thumbnail = item.cakeDetailDTO.thumbnailImageUrl;

        itemSubTotalPrice = (unitPrice * quantity); // 케이크 기본 가격 * 수량

        // 옵션 처리: item.options (Map<Long, Integer>)와 item.cakeDetailDTO.options (List<CakeOptionMapping>) 조합
        if (item.options && typeof item.options === 'object' &&
            item.cakeDetailDTO.options && Array.isArray(item.cakeDetailDTO.options)) {

            let currentOptionsTotalPrice = 0; // 이 함수 내에서 계산될 옵션만의 총 가격

            Object.entries(item.options).forEach(([mappingIdStr, count]) => {
                const mappingId = Number(mappingIdStr); // 키가 문자열일 수 있으므로 숫자로 변환

                // item.cakeDetailDTO.options는 List<CakeOptionMapping> 형태입니다.
                // 각 CakeOptionMapping 객체는 mappingId와 optionItem (OptionItem 엔티티)을 가집니다.
                const foundOptionMapping = item.cakeDetailDTO.options.find(
                    (optMap) => optMap.mappingId === mappingId // 숫자 비교
                );

                if (foundOptionMapping && foundOptionMapping.optionItem) {
                    const optionPrice = foundOptionMapping.optionItem.price || 0;
                    const optionCount = count || 1;

                    selectedOptions.push({
                        mappingId: mappingId,
                        optionName: foundOptionMapping.optionItem.optionName,
                        price: optionPrice,
                        count: optionCount,
                        // ⭐ [중요] optionType에서 typeName을 가져와 optionGroup에 할당 ⭐
                        optionType: foundOptionMapping.optionItem.optionType?.typeName // OptionType 엔티티의 typeName이 그룹 이름이라고 가정
                    });
                    currentOptionsTotalPrice += (optionPrice * optionCount);
                } else {
                    console.warn("[getItemDetails] 직접 주문 옵션: 매핑 정보를 찾을 수 없습니다:", mappingId, item.cakeDetailDTO.options);
                    selectedOptions.push({
                        mappingId: mappingId,
                        optionName: `알 수 없는 옵션 (${mappingId})`,
                        price: 0,
                        count: count,
                        optionType: "알 수 없음"
                    });
                }
            });
            totalOptionsPrice = currentOptionsTotalPrice; // 옵션들만의 총 가격 확정
            itemSubTotalPrice += totalOptionsPrice; // 케이크 기본 가격에 옵션 총 가격 합산
        } else {
            // item.options가 없거나 cakeDetailDTO.options가 없으면 옵션 없음
            selectedOptions = [];
            totalOptionsPrice = 0;
        }


    } else if (item.orderItemId) { // 3. 이미 생성된 주문 아이템인 경우 (주문 상세/목록에서 사용)
        name = item.cname;
        unitPrice = item.price; // 이 price는 base price일 수 있음
        quantity = item.productCnt;
        thumbnail = item.thumbnailImageUrl;
        itemSubTotalPrice = item.itemSubTotalPrice || (unitPrice * quantity); // 백엔드에서 계산된 final item price

        if (item.selectedOptions && Array.isArray(item.selectedOptions)) {
            selectedOptions = item.selectedOptions; // 이미 백엔드에서 가공된 selectedOptions 배열을 사용
            totalOptionsPrice = selectedOptions.reduce((sum, option) =>
                    sum + (option.price || 0) * (option.count || 1)
                , 0);
        } else {
            selectedOptions = [];
            totalOptionsPrice = 0;
        }

    } else { // 4. 기타 예상치 못한 구조
        name = item.name || item.cname || "상품";
        unitPrice = item.price || item.unitPrice || 0;
        quantity = item.quantity || item.productCnt || 1;
        thumbnail = item.thumbnailImageUrl || item.thumbnail || null;
        itemSubTotalPrice = item.itemTotalPrice || (unitPrice * quantity);
        selectedOptions = [];
        totalOptionsPrice = 0;
    }

    return {
        name,
        unitPrice,
        quantity,
        thumbnail,
        selectedOptions, // 이제 옵션 상세 객체 배열을 직접 반환
        totalOptionsPrice, // 옵션들만의 총 가격을 반환
        itemSubTotalPrice // 케이크 가격 + 옵션 가격의 총 합을 반환 (이 값을 최종 상품 가격으로 표시)
    };
};