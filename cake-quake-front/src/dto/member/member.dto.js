
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

export const PasswordChangeDTO = (formData) => {
    return {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
    }
}

