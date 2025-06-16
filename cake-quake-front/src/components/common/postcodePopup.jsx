/* Daum 우편번호 검색 서비스 팝업 기능 */

import { useDaumPostcodePopup } from 'react-daum-postcode';

const PostcodePopup = ({ onComplete }) => {
  const scriptUrl = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
  const open = useDaumPostcodePopup(scriptUrl)

  const handleComplete = (data) => {
    let fullAddress = data.address
    let extraAddress = ''

    if (data.addressType === 'R') {
      if (data.bname !== '') extraAddress += data.bname;
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : ''
    }

    if (onComplete) {
      onComplete(fullAddress) // 부모로 주소 전달
    }
  }

  const handleClick = () => {
    open({ onComplete: handleComplete })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="whitespace-nowrap px-4 py-2 bg-cyan-100 hover:bg-cyan-400 text-cyan-950 font-semibold rounded-lg shadow-md transition-colors duration-200"
    >
      검색
    </button>
  );
}

export default PostcodePopup;
