import {useParams} from "react-router";
import ShopNoticeForm from "../../components/shop/shopNoticeForm.jsx";

const ShopNoticeCreatePage=()=>{
    const {cid:shopId}=useParams();

    if(!shopId){
        return(
            <div className="p-4 max-w-3xl mx-auto text-center text-red-700">
                <p>유효하지 않은 매장 정보입니다. 매장 ID가 필요합니다.</p>
            </div>
        );
    } //end if

    return (
        <ShopNoticeForm shopId={shopId} />
    );

};

export default ShopNoticeCreatePage;