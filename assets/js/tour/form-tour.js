import { validateTourName, validateDuration, validateInfoTour } from "../validate.js";

(function () {
    'use strict'

    const fields = [
        { selector: '#tourName', validate: validateTourName, msg: 'Tên tour nằm trong khoảng 15 đến 255 ký tự' },
        { selector: '#tourDuration', validate: validateDuration, msg: 'Từ 1 đến 60 ngày' },
        { selector: '#tourDeparture', validate: validateInfoTour, msg: 'Độ dài từ 6 đến 255 ký tự' },
        { selector: '#tourAttractions', validate: validateInfoTour, msg: 'Độ dài từ 6 đến 255 ký tự' },
        { selector: '#tourTarget', validate: validateInfoTour, msg: 'Độ dài từ 6 đến 255 ký tự' },
        { selector: '#tourCuisine', validate: validateInfoTour, msg: 'Độ dài từ 6 đến 255 ký tự' },
        { selector: '#tourIdealTime', validate: validateInfoTour, msg: 'Độ dài từ 6 đến 255 ký tự' },
    ];

    function validateField($input, isValid, msg) {
        $input.toggleClass('is-invalid', !isValid);
        $input.toggleClass('is-valid', isValid);
        if (!isValid) $input.next().next().text(msg);
        return isValid;
    }

    fields.forEach(field => {
        $(field.selector).on('input', function () {
            validateField($(this), field.validate(this.value), this.msg);
        })
    })

    // Gắn sự kiện input và change cho tất cả input/select trong form
    // $('#bookingForm').on('input change', 'input, select, textarea', function () {
    //     if (form.checkValidity() && $('#bookingForm').find(".is-invalid").length === 0) {
    //         $('#book').prop('disabled', false);  // Bật nút
    //     } else {
    //         $('#book').prop('disabled', true);   // Tắt nút
    //     }
    // });

    // Hàm khởi tạo Quill editor có validate
    function initQuillEditor(selector, minLength = 0, errorMessage = '') {
        const quill = new Quill(selector, { theme: 'snow' });
        const $editor = $(`${selector} .ql-editor`);
        let $feedback = $editor.parent().next('.invalid-feedback');

        // Nếu có yêu cầu validate độ dài thì gắn sự kiện
        if (minLength > 0 && errorMessage) {
            quill.on('text-change', function () {
                const text = quill.getText().trim();

                // Nếu chưa có thẻ invalid-feedback thì tạo
                if ($feedback.length === 0) {
                    $feedback = $('<div>')
                        .addClass('invalid-feedback d-block')
                        .text(errorMessage)
                        .insertAfter($editor.parent())
                        .hide(); // Ẩn mặc định
                }

                // Kiểm tra và hiển thị lỗi
                if (text.length < minLength) $feedback.show();
                else $feedback.hide();
            });
        }

        // Thêm method validate thủ công cho bên ngoài gọi
        quill.validate = function () {
            const text = quill.getText().trim();
            if (text.length < minLength) {
                $feedback.show();
                return false;
            } else {
                $feedback.hide();
                return true;
            }
        };

        return quill;
    }

    // Khởi tạo các editor
    const quillIncluded = initQuillEditor('#quill-included', 20, 'Độ dài từ 20 ký tự trở lên.');
    const quillNotIncluded = initQuillEditor('#quill-not-included', 20, 'Độ dài từ 20 ký tự trở lên.');
    const quillDescription = initQuillEditor('#quill-description', 20, 'Độ dài từ 20 ký tự trở lên.');

    const tourQuill = [quillIncluded, quillNotIncluded, quillDescription];

    const quillInstances = []; // lưu các quill được khởi tạo

    function createQuillEditor() {
        const editorWrapper = $('<div class="quill-wrapper mb-3"></div>');
        const editorDiv = $('<div class="quill-editor-2"></div>');
        const feedback = $('<div class="invalid-feedback" style="display: none">Nội dung quá ngắn</div>');

        editorWrapper.append(editorDiv).append(feedback);
        $('#quill-container').append(editorWrapper);

        const quill = new Quill(editorDiv[0], { theme: 'snow' });

        // Gắn sự kiện validate nếu muốn
        quill.on('text-change', function () {
            const text = quill.getText().trim();
            if (text.length < 10) {
                feedback.show();
            } else {
                feedback.hide();
            }
        });

        // Lưu lại đối tượng
        quillInstances.push({ quill, wrapper: editorWrapper });
    }

    function removeLastQuillEditor() {
        if (quillInstances.length > 0) {
            const last = quillInstances.pop();
            last.wrapper.remove(); // xóa cả DOM chứa editor
            // Không cần gọi .destroy vì Quill chưa hỗ trợ chính thức, remove DOM là đủ
        }
    }

    // Gắn sự kiện nút
    $('#btn-add').on('click', createQuillEditor);
    $('#btn-remove').on('click', removeLastQuillEditor);

    quillInstances.forEach(({ quill, wrapper }) => {
        if (!wrapper.hasClass('d-none')) {
            const text = quill.getText().trim();
            // Validate...
        }
    });

    function hideQuillEditor(index) {
        const instance = quillInstances[index];
        if (instance) {
            instance.wrapper.hide(); // ẩn cả wrapper
        }
    }

    function showQuillEditor(index) {
        const instance = quillInstances[index];
        if (instance) {
            instance.wrapper.show();
        }
    }

    let autoSaveData = {}; // JSON tạm
    // Hàm tự động lưu mỗi 5 giây
    function autoSaveQuillContent() {
        quillInstances.forEach((instance, i) => {
            const content = instance.quill.root.innerHTML;
            autoSaveData[`editor${i + 1}`] = content;
        });

        // Lưu vào localStorage (tuỳ chọn)
        localStorage.setItem('quillAutoSave', JSON.stringify(autoSaveData));

        console.log('Đã tự động lưu:', autoSaveData);
    }

    // Gọi autoSave mỗi 5 giây
    // setInterval(autoSaveQuillContent, 5000);

    const savedData = localStorage.getItem('quillAutoSave');
    if (savedData) {
        const parsedData = JSON.parse(savedData);

        Object.keys(parsedData).forEach((key, i) => {
            createQuillEditor(i);
            // Delay 1 chút cho Quill khởi tạo xong
            setTimeout(() => {
                quillInstances[i].quill.root.innerHTML = parsedData[key];
            }, 100);
        });
    } else {
        createQuillEditor(0); // Tạo ít nhất 1 editor
    }


    document.querySelectorAll('.quill-editor-2').forEach(function (el) {
        const quill = new Quill(el, {
            modules: {
                toolbar: [
                    [{ font: [] }, { size: [] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ color: [] }, { background: [] }],
                    [{ script: 'super' }, { script: 'sub' }],
                    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                    ['direction', { align: [] }],
                    ['link', 'image', 'video'],
                    ['clean']
                ]
            },
            theme: 'snow'
        });

        el.__quill = quill;
    });

    let flag = true;
    $('#vehicle input[type="checkbox"]').on("change", function () {
        flag = $('#vehicle input[type="checkbox"]:checked').length == 0;
        $('#vehicle input[type="checkbox"]').toggleClass('is-invalid', flag);
        $('#vehicle input[type="checkbox"]').toggleClass('is-valid', !flag);
        $('#vehicle').find('div').last().toggleClass('d-none', !flag);
        $('#vehicle').find('div').last().toggleClass('d-block', flag);
        if (flag) $('#vehicle').find('div').last().text("Chọn ít nhất 1 phương tiện.");
    })

    // Lấy form
    const form = document.getElementById('tourForm');

    // $('#continueBtn')
    form.addEventListener('submit', function (event) {

        let isValidForm = true;

        fields.forEach(field => {
            const $input = $(field.selector);
            if (!validateField($input, field.validate($input.val()), field.message)) {
                isValidForm = false;
            }
        });

        if (!this.checkValidity() || !isValidForm || flag) {
            event.preventDefault();
            event.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        const includedContent = quillIncluded.getText().trim(); // Lấy text, không phải HTML

        // const content = tinymce.get("quill-included").getContent();

        document.querySelectorAll('.quill-editor-2').forEach(function (el, index) {
            const quill = el.__quill;
            if (quill) {
                const contentHtml = quill.root.innerHTML; // Lấy HTML
                const contentText = quill.getText();       // Lấy plain text
                console.log(`Editor ${index + 1} (HTML):`, contentHtml);
                console.log(`Editor ${index + 1} (Text):`, contentText);
            } else {
                console.log("HELLO2");
            }
        });

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

    function createQuillEditor() {
        const editorWrapper = $('<div class="quill-wrapper mb-3"></div>');
        const editorDiv = $('<div class="quill-editor-2"></div>');
        const feedback = $('<div class="invalid-feedback" style="display: none">Nội dung quá ngắn</div>');

        editorWrapper.append(editorDiv).append(feedback);
        $('#quill-container').append(editorWrapper);

        const quill = new Quill(editorDiv[0], { theme: 'snow' });

        // Gắn sự kiện validate nếu muốn
        quill.on('text-change', function () {
            const text = quill.getText().trim();
            if (text.length < 10) {
                feedback.show();
            } else {
                feedback.hide();
            }
        });

        // Lưu lại đối tượng
        quillInstances.push({ quill, wrapper: editorWrapper });
    }

    $('#addTour').click(function () {
        if ($(this).text() == "Thêm tour mới") {
            let isValidForm = true;

            fields.forEach(field => {
                const $input = $(field.selector);
                if (!validateField($input, field.validate($input.val()), field.message)) {
                    isValidForm = false;
                }
            });

            const files = $('#tourImage')[0].files;
            if (files.length === 0) {
                isValidForm = false;
            }

            tourQuill.forEach(quill => {
                if (!quill.validate()) isValidForm = false;
            })

            // if (!this.checkValidity() || !isValidForm || flag) {
            //     $('#tourForm').addClass("was-validated");
            //     return;
            // }

            tourQuill.forEach(quill => {
                quill.enable(false);
            })

            $('#tourForm').find('input[type="checkbox"]').on('click', function (e) {
                e.preventDefault();
            })

            $('#tourForm').find('input:not([type="file"]), textarea').prop('readonly', true);

            $('#idCategory').on('focus, click', function (e) {
                this.blur();
            })

            $('#tourImage').on('click drop keydown', function (e) {
                e.preventDefault();
            });

            $(this).text("Sửa");
        } else if($(this).text() == "Sửa"){
            $(this).text("Lưu tour");
        }
    })
})();