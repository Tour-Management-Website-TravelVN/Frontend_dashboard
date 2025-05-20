import { validateTourName, validateDuration, validateInfoTour } from "../validate.js";

(function () {
    'use strict'

    $('#tourName').on(
        'input', function () {
            if (!validateTourName($('#tourName').val())) {
                $(this).addClass('is-invalid');
                $(this).removeClass('is-valid');
                $(this).next().next().text('Tên tour nằm trong khoảng 15 đến 255 ký tự');
            } else {
                $(this).removeClass('is-invalid');
                $(this).addClass('is-valid');
            }
        }
    )

    $('#tourDuration').on(
        'input', function () {
            if (!validateDuration($('#tourDuration').val())) {
                $(this).addClass('is-invalid');
                $(this).removeClass('is-valid');
                $(this).next().next().text('Từ 1 đến 60 ngày');
            } else {
                $(this).removeClass('is-invalid');
                $(this).addClass('is-valid');
            }
        }
    )

    $('#tourDeparture').on(
        'input', function () {
            if (!validateInfoTour($('#tourDeparture').val())) {
                $(this).addClass('is-invalid');
                $(this).removeClass('is-valid');
                $(this).next().next().text('Độ dài từ 6 đến 255 ký tự');
            } else {
                $(this).removeClass('is-invalid');
                $(this).addClass('is-valid');
            }
        }
    )

    $('#tourAttractions').on(
        'input', function () {
            if (!validateInfoTour($('#tourAttractions').val())) {
                $(this).addClass('is-invalid');
                $(this).removeClass('is-valid');
                $(this).next().next().text('Độ dài từ 6 đến 255 ký tự');
            } else {
                $(this).removeClass('is-invalid');
                $(this).addClass('is-valid');
            }
        }
    )

    $('#tourTarget').on(
        'input', function () {
            if (!validateInfoTour($('#tourTarget').val())) {
                $(this).addClass('is-invalid');
                $(this).removeClass('is-valid');
                $(this).next().next().text('Độ dài từ 6 đến 255 ký tự');
            } else {
                $(this).removeClass('is-invalid');
                $(this).addClass('is-valid');
            }
        }
    )

    $('#tourCuisine').on(
        'input', function () {
            if (!validateInfoTour($('#tourCuisine').val())) {
                $(this).addClass('is-invalid');
                $(this).removeClass('is-valid');
                $(this).next().next().text('Độ dài từ 6 đến 255 ký tự');
            } else {
                $(this).removeClass('is-invalid');
                $(this).addClass('is-valid');
            }
        }
    )



    $('#tourIdealTime').on(
        'input', function () {
            if (!validateDuration($('#tourIdealTime').val())) {
                $(this).addClass('is-invalid');
                $(this).removeClass('is-valid');
                $(this).next().next().text('Độ dài từ 6 đến 255 ký tự');
            } else {
                $(this).removeClass('is-invalid');
                $(this).addClass('is-valid');
            }
        }
    )

    // Lấy form
    const form = document.getElementById('tourForm');


    // Gắn sự kiện input và change cho tất cả input/select trong form
    // $('#bookingForm').on('input change', 'input, select, textarea', function () {
    //     if (form.checkValidity() && $('#bookingForm').find(".is-invalid").length === 0) {
    //         $('#book').prop('disabled', false);  // Bật nút
    //     } else {
    //         $('#book').prop('disabled', true);   // Tắt nút
    //     }
    // });


    // $('#continueBtn')
    form.addEventListener('submit', function (event) {

        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }
        const includedContent = quillIncluded.getText().trim(); // Lấy text, không phải HTML

        // Nếu nội dung trống
        if (includedContent === '') {
            event.preventDefault();
            event.stopPropagation();

            // Hiển thị lỗi
            document.getElementById('quill-included').classList.add('is-invalid');

            // Nếu chưa có div hiển thị lỗi thì thêm
            if (!document.querySelector('#quill-included + .invalid-feedback')) {
                const error = document.createElement('div');
                error.className = 'invalid-feedback d-block';
                error.innerText = 'Vui lòng nhập thông tin đã bao gồm.';
                document.getElementById('quill-included').after(error);
            }

        } else {
            // Xóa lỗi nếu có
            document.getElementById('quill-included').classList.remove('is-invalid');
            const feedback = document.querySelector('#quill-included + .invalid-feedback');
            if (feedback) feedback.remove();
        }

        form.classList.add('was-validated');
    }, false);
})();