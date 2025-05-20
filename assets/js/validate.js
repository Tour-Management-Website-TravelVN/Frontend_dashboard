//Kiểm tra tên đầy đủ
export function validateFullName(fullname) {
    const fullNameRegex = /^[A-Za-zÀ-ỹ\s]{4,49}[A-Za-zÀ-ỹ]$/;
    return (fullNameRegex.test(fullname) && fullname.includes(' '));
}

//Kiểm tra email
export function validateEmail(email) {
    // Biểu thức chính quy (regex) đơn giản để kiểm tra định dạng email cơ bản
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Kiểm tra xem email có khớp với regex hay không
    return emailRegex.test(email);
}

//Kiểm tra tuổi dựa vào ngày sinh
export function validateAge(birthDateValue) {
    if (!birthDateValue) {
        return false; // Hoặc xử lý trường hợp không có ngày sinh
    }

    const birthDate = new Date(birthDateValue);
    const currentDate = new Date();

    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDifference = currentDate.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())) {
        age--;
    }

    return age >= 15 && age <= 125;
}

//Kiểm tra  độ tuổi xác định dựa vào ngày sinh
export function validateAgeRange(birthDateValue, minAge, maxAge) {
    if (!birthDateValue) {
        return false; // Hoặc xử lý trường hợp không có ngày sinh
    }

    const birthDate = new Date(birthDateValue);
    const currentDate = new Date();

    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDifference = currentDate.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())) {
        age--;
    }

    return age >= minAge && age <= maxAge;
}

//Kiểm tra tên đăng nhập
export function validateUsername(username) {
    // Biểu thức chính quy:
    // ^: Bắt đầu chuỗi
    // [a-zA-Z0-9]+: Một hoặc nhiều ký tự chữ (hoa hoặc thường) hoặc số
    // $: Kết thúc chuỗi
    const usernameRegex = /^[a-zA-Z0-9]+$/;

    // Kiểm tra độ dài và định dạng
    return username.length >= 8 && username.length <= 40 && usernameRegex.test(username);
}

//Kiểm tra mật khẩu
export function validatePwd(pwd) {
    return pwd.length >= 6 && pwd.length <= 20;
}

//Kiểm tra họ và họ đệm
export function validateFirstName(firstname) {
    const firstNameRegex = /^[A-Za-zÀ-ỹ\s]{2,40}[A-Za-zÀ-ỹ]$/;
    return (firstNameRegex.test(firstname) && firstname.includes(' '));
}

//Kiểm tra tên
export function validateLastName(lastname) {
    const regex = /^[A-Za-zÀ-ỹ]{2,10}$/;
    return regex.test(lastname);
}

//Kiểm tra cccd
export function validateCI(ci){
    const regex = /^[0-9]{12}$/;
    return regex.test(ci);
}

//Kiểm tra số hộ chiếu
export function validatePassport(passport){
    const regex = /^[A-Z0-9]{6,16}$/;
    return regex.test(passport);
}

//Kiểm tra số điện thoại
export function validatePhoneNumber(pn){
    const regex = /^(032|033|034|035|036|037|038|039|096|097|098|086|083|084|085|081|082|088|091|094|070|079|077|076|078|090|093|089|056|058|092|059|099)[0-9]{7}$/;
    return regex.test(pn);
}

//Kiểm tra mật khẩu
export function validateVerifyPwd(newPwd, verPwd){
    return newPwd === verPwd;
}

//Kiểm tra nội dung đánh giá
export function vaidateComment(textareaElement) {
    if (!textareaElement) {
      return false; // Kiểm tra nếu phần tử textarea không tồn tại (null hoặc undefined)
    }
    const text = textareaElement.value.trim(); // Lấy giá trị và loại bỏ khoảng trắng ở đầu và cuối
    return text.length > 0; // Kiểm tra xem chuỗi còn lại có độ dài lớn hơn 0 hay không
  }

//Kiểm tra địa chỉ
export function validateAddress(param) {
    return param.length > 20 && param.length <= 255; // Kiểm tra xem chuỗi còn lại có độ dài lớn hơn 0 hay không
  }

//Kiểm tra cccd
export function validateCILite(ci){
    if(ci == null || ci.trim() == "")
        return true;
    const regex = /^[0-9]{12}$/;
    return regex.test(ci);
}

//Kiểm tra số hộ chiếu
export function validatePassportLite(passport){
    if(passport == null || passport.trim() == "")
        return true;
    const regex = /^[A-Z0-9]{6,16}$/;
    return regex.test(passport);
}

//Kiểm tra số điện thoại
export function validatePhoneNumberLite(pn){
    if(pn == null || pn.trim() == "")
        return true;
    const regex = /^(032|033|034|035|036|037|038|039|096|097|098|086|083|084|085|081|082|088|091|094|070|079|077|076|078|090|093|089|056|058|092|059|099)[0-9]{7}$/;
    return regex.test(pn);
}

  //Kiểm tra địa chỉ
export function validateAddressLite(param) {
    if(param == null || param.trim() == "")
        return true;
    return param.length > 20 && param.length <= 255; // Kiểm tra xem chuỗi còn lại có độ dài lớn hơn 0 hay không
  }

  //Kiểm tra tên tour
  export function validateTourName(param) {
    if(param == null || param.trim() == "")
        return false;
    return param.length >= 15 && param.length <= 255; // Kiểm tra xem chuỗi còn lại có độ dài lớn hơn 0 hay không
  }

  //Kiểm tra thời lương tour
  export function validateDuration(param){
     if(param == null || param.trim() == "")
        return false;
    let tourDuration = parseInt(param);
    return (tourDuration>=1 && tourDuration<= 60)
  }

  //Kiểm tra độ dài thông tin tour
  export function validateInfoTour(param){
    if(param == null || param.trim() == "")
        return false;
    return param.length >= 6 && param.length <= 255;
  }

   //Kiểm tra độ dài thông tin tour
  export function validateLongInfoTour(param){
    if(param == null || param.trim() == "")
        return false;
    return param.length >= 20;
  }