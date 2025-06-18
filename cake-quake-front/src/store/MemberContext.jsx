import { createContext, useContext } from "react";

const MemberContext = createContext(null)

export const MemberProvider = ({ children }) => {
    const [sellerProfile, setSellerProfile] = useState(null)
    const [buyerProfile, setBuyerProfile] = useState(null)

    return (
        <MemberContext.Provider value={{ sellerProfile, setSellerProfile, buyerProfile, setBuyerProfile }}>
            {children}
        </MemberContext.Provider>
    )
}

export const useMember = () => useContext(MemberContext)