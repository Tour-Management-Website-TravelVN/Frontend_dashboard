import { validateLength } from "../validate.js"

$(function () {

    const toast = new bootstrap.Toast($('#myToast'));
    const viewFes = new bootstrap.Modal($('#viewFes'));
    const updateFes = new bootstrap.Modal($('#updateFes'));
    const delFes = new bootstrap.Modal($('#staticBackdrop'));
    //toast.show();

    //VALIDATE
    const fields = [
        { selector: '#festiName', validate: (value) => validateLength(value, 10, 255), msg: 'Độ dài nằm trong khoảng 10 đến 255 ký tự' },
        { selector: '#festiName2', validate: (value) => validateLength(value, 10, 255), msg: 'Độ dài nằm trong khoảng 10 đến 255 ký tự' }
    ];

    function validateField($input, isValid, msg) {
        $input.toggleClass('is-invalid', !isValid);
        $input.toggleClass('is-valid', isValid);
        if (!isValid) {
            $input.siblings('.invalid-feedback').text(msg);
        }
        return isValid;
    }

    fields.forEach(field => {
        $(field.selector).on('input', function () {
            validateField($(this), field.validate(this.value), field.msg);
        })
    })

    $('#formUpdate .bi-eye, #formAdd .bi-eye').click(function () {
        $(this).toggleClass('d-none');
        $(this).next().toggleClass('d-none');
    })

    $('#formUpdate .bi-eye-slash, #formAdd .bi-eye-slash').click(function () {
        $(this).toggleClass('d-none');
        $(this).prev().toggleClass('d-none');
    })

    //FORM
    $('#formAdd').on('submit', function (e) {
        e.preventDefault(); // Ngăn submit mặc định

        if (this.checkValidity && validateLength($('#festiName').val(), 10, 255)) {

            let festival = {
                festivalName: $('#festiName').val().trim(),
                description: $('#festiDes').val(),
                displayStatus: $('#formAdd .bi-eye').is(':visible')
            }

            let formData = new FormData();
            formData.append("festival", JSON.stringify(festival));
            console.log(JSON.stringify(festival));

            $.ajax({
                url: '/adv/to/festival?action=add',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (res) {
                    if (res.rs) {
                        window.location.href = window.location.href;
                    } else {
                        displayAlert('Tên lễ hội đã tồn tại');
                    }
                },
                error: function (err) {
                    displayAlert("Có lỗi xảy ra");
                }
            });
        } else {
            displayAlert('Hãy kiểm tra lại thông tin nhập vào');
        }
        $('#formAdd').removeClass('was-validated');
        $('#formAdd').find('.is-valid').removeClass('is-valid');
    });

    function displayAlert(msg) {
        $('.toast-body').text(msg);
        toast.show();
    }

    $('#formUpdate').on('submit', function (e) {
        e.preventDefault(); // Ngăn submit mặc định

        if (this.checkValidity && validateLength($('#festiName2').val(), 10, 255)) {
            let festival = {
                id: $('#festiId2').val(),
                festivalName: $('#festiName2').val().trim(),
                description: $('#festiDes2').val(),
                displayStatus: $('#formUpdate .bi-eye').is(':visible')
            }

            console.log(JSON.stringify(festival));
            console.log("HELLO");

            let formData = new FormData();
            formData.append("festival", JSON.stringify(festival));

            //ERROR
            $.ajax({
                url: '/adv/to/festival?action=update',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (res) {
                    if (res.rs) {
                        window.location.href = window.location.href;
                    } else {
                        displayAlert('Không thể sửa')
                    }
                },
                error: function (err) {
                    displayAlert("Có lỗi xảy ra");
                }
            });
        } else {
            displayAlert("Kiểm tra lại dữ liệu nhập");
        }
        $('#formUpdate').removeClass('was-validated');
        $('#formUpdate').find('.is-valid').removeClass('is-valid');
    });

    $('table').on('click', '.btnDel', function () {
        let fesName = $(this).closest('tr').find('.fesName').text().trim();
        let fesId = $(this).closest('tr').find('.fesId').text().trim();
        //console.log('disName:', disName, 'disId:', disId);

        $.ajax({
            url: '/adv/to/festival',
            type: 'GET',
            data: {
                check: true,
                festivalid: fesId
            },
            success: function (res) {
                if (!res.check) {
                    //discount : {}
                    delFes.hide();
                    displayAlert('Không thể xóa');
                } else {
                    delFes.show();
                }
            },
            error: function (err) {
                displayAlert("Có lỗi xảy ra");
            }
        });

        $('#staticBackdrop .modal-body').text("Bạn có muốn xóa " + fesName);

        $('.btnDelete').off('click').on('click', function () {
            console.log('Click btnDelete with disId:', fesId);
            // Thêm đoạn code xóa hoặc xử lý ở đây
            $.ajax({
                url: '/adv/to/festival',
                type: 'POST',
                data: {
                    action: 'del',
                    festivalid: fesId
                },
                success: function (res) {
                    if (res.rs) {
                        //discount : {}
                        delFes.hide();
                        displayAlert('Xóa thành công');
                        $(`tbody td[data-id="${fesId}"]`).parent().remove();
                    } else {
                        displayAlert('Xóa không thành công');
                    }
                },
                error: function (err) {
                    //updateDis.show();
                    displayAlert("Có lỗi xảy ra");
                }
            });
        });
    });

    $('#formView').on('click', '.btnDel', function () {
        let fesName = $('#festivalName').val();
        let fesId = $('#festivalId').val();
        //console.log('disName:', disName, 'disId:', disId);

        $.ajax({
            url: '/adv/to/festival',
            type: 'GET',
            data: {
                check: true,
                festivalid: fesId
            },
            success: function (res) {
                if (!res.check) {
                    //discount : {}
                    delFes.hide();
                    displayAlert('Không thể xóa');
                } else {
                    viewFes.hide();
                    delFes.show();
                }
            },
            error: function (err) {
                displayAlert("Có lỗi xảy ra");
            }
        });

        $('#staticBackdrop .modal-body').text("Bạn có muốn xóa " + fesName);

        $('.btnDelete').off('click').on('click', function () {
            console.log('Click btnDelete with fesId:', fesId);
            // Thêm đoạn code xóa hoặc xử lý ở đây
            $.ajax({
                url: '/adv/to/festival',
                type: 'POST',
                data: {
                    action: 'del',
                    festivalid: fesId
                },
                success: function (res) {
                    if (res.rs) {
                        //discount : {}
                        delFes.hide();
                        displayAlert('Xóa thành công');
                        $(`tbody td[data-id="${fesId}"]`).parent().remove();
                    } else {
                        displayAlert('Xóa không thành công');
                    }
                },
                error: function (err) {
                    //updateDis.show();
                    displayAlert("Có lỗi xảy ra");
                }
            });
        });
    });

    // $('#formView').on('click', '#btnChange', function(){
    //     $('#festiId2').val($('#festivalId').val());
    //     $('#festiName2').val($('#festivalName').val());
    //     $('#festiDes2').val($('#festivalDes').val());
    //     let flag = $('#formView .bi-eye').is(':visible');
    //     console.log(flag);
    //     if (flag) {
    //         $('#formUpdate .bi-eye').removeClass('d-none');
    //         $('#formUpdate .bi-eye-slash').addClass('d-none');
    //     } else {
    //         $('#formUpdate .bi-eye-slash').removeClass('d-none');
    //         $('#formUpdate .bi-eye').addClass('d-none');
    //     }
    // })

    $('#btnChange').click(function () {
        $('#festiId2').val($('#festivalId').val());
        $('#festiName2').val($('#festivalName').val());
        $('#festiDes2').val($('#festivalDes').val());
        let flag = $('#formView .bi-eye').is(':visible');
        console.log(flag);
        viewFes.hide();
        updateFes.show();
        if (flag) {
            $('#formUpdate .bi-eye').removeClass('d-none');
            $('#formUpdate .bi-eye-slash').addClass('d-none');
        } else {
            $('#formUpdate .bi-eye-slash').removeClass('d-none');
            $('#formUpdate .bi-eye').addClass('d-none');
        }
    })

    $('table').on('click', '.btnUpdate', function () {
        let fesId = $(this).closest('tr').find('.fesId').text();
        let fesName = $(this).closest('tr').find('.fesName').text();
        let fesDes = $(this).closest('tr').find('.fesDes').data('des');
        let flag = $(this).parent().siblings('.status').find('.bi-eye').is(':visible');

        $('#festiId2').val(fesId);
        $('#festiName2').val(fesName);
        $('#festiDes2').val(fesDes);
        if (flag) {
            $('#formUpdate .bi-eye').removeClass('d-none');
            $('#formUpdate .bi-eye-slash').addClass('d-none');
        } else {
            $('#formUpdate .bi-eye-slash').removeClass('d-none');
            $('#formUpdate .bi-eye').addClass('d-none');
        }
    });

    $('td[data-bs-target="#viewFes"]').click(function () {
        console.log("VIEW");

        let $tr = $(this).parent();
        $('#festivalId').val($tr.find('.fesId').text());
        $('#festivalName').val($tr.find('.fesName').text());
        $('#festivalDes').val($tr.find('.fesDes').data('des'));
        let flag = $tr.find('.bi-eye').is(':visible');

        if (flag) {
            $('#formView .bi-eye').removeClass('d-none');
            $('#formView .bi-eye-slash').addClass('d-none');
        } else {
            $('#formView .bi-eye-slash').removeClass('d-none');
            $('#formView .bi-eye').addClass('d-none');
        }
    });

    $('#page').on('change', function () {
        // console.log($('#page').val());
        window.location.href = $('#page').val();
    });

    $('tbody .status').click(function () {
        let $clicked = $(this); // giữ lại `this` đúng ngữ cảnh
        let flag = $clicked.find('.bi-eye').is(":visible");

        $.ajax({
            url: '/adv/to/festival',
            type: 'POST',
            data: {
                action: 'visible',
                festivalid: parseInt($clicked.siblings('.fesId').text()),
                visible: !flag
            },
            success: function (res) {
                if (res.rs) {
                    $clicked.find('.bi-eye').toggleClass('d-none');
                    $clicked.find('.bi-eye-slash').toggleClass('d-none');
                    $clicked.attr('data-order', !flag ? "Hiện" : "Ẩn");
                    $clicked.attr('data-search', !flag ? "Hiện" : "Ẩn");
                } else {
                    displayAlert('Thay đổi không thành công');
                }
            },
            error: function (err) {
                displayAlert("Có lỗi xảy ra");
            }
        });
    });

})