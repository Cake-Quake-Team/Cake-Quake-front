
export const createBuyerSignupDTO = (formData) => {
    return {
        userId: formData.userId,
        password: formData.password,
        uname: formData.uname,
        phoneNumber: formData.phoneNumber,
        publicInfo: formData.publicInfo,
        alarm: formData.alarm,
        joinType: formData.joinType ?? "basic",
    }
}

export const sellerSignupStep1DTO = (formData) => {
    return {
        userId: formData.userId,
        password: formData.password,
        uname: formData.uname,
        phoneNumber: formData.phoneNumber,
        businessNumber: formData.businessNumber,
        bossName: formData.bossName,
        openingDate: formData.openingDate,
        shopName: formData.shopName,
        joinType: formData.joinType ?? "basic",
    }
}