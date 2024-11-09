import React from 'react';

const regex = (pattern, text) => {
    const regexPattern = new RegExp(pattern);
    return regexPattern.test(text);
};

// Hàm kiểm tra số có đúng 10 chữ số
export const isTenDigitNumber = (text) => {
    const pattern = /^\d{10}$/;
    return regex(pattern, text);
};

// Hàm kiểm tra ngày sinh (định dạng DD/MM/YYYY hoặc YYYY-MM-DD)
export const isBirthdate = (text) => {
    // Kiểm tra định dạng YYYY-MM-DD
    const pattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!pattern.test(text)) {
        return false;
    }

    // Chuyển chuỗi thành đối tượng Date
    const inputDate = new Date(text);
    //ngày hiện tại
    const today = new Date();

    // Đặt thời gian của ngày hôm nay về đầu ngày để so sánh chính xác
    today.setHours(0, 0, 0, 0);

    // Kiểm tra nếu inputDate là một ngày hợp lệ và trước ngày hôm nay
    return !isNaN(inputDate) && inputDate < today;
};



// Hàm kiểm tra giá khóa học (phải là số dương, không âm)
export const isCoursePricePositive = (text) => {
    const pattern = /^\d+(\.\d{1,2})?$/; // chấp nhận số nguyên hoặc số thập phân
    return regex(pattern, text);
};

// Hàm kiểm tra địa chỉ ví Ethereum (bắt đầu bằng 0x và có 40 ký tự sau đó)
export const isWalletAddress = (text) => {
    const pattern = /^0x[a-fA-F0-9]{40}$/;
    return regex(pattern, text);
};

// Hàm kiểm tra email hợp lệ
export const isEmail = (text) => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex(pattern, text);
};



export const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};
export default {
    isTenDigitNumber,
    isBirthdate,
    isCoursePricePositive,
    isWalletAddress,
    isEmail,isValidPassword
};
