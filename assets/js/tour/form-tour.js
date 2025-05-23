import { validateTourName, validateDuration, validateInfoTour } from "../validate.js";

(function () {
    'use strict'

    const existingImages = [
        { id: 'abc123.jpg', url: 'https://baodongnai.com.vn/file/e7837c02876411cd0187645a2551379f/dataimages/201706/original/images1920558_4053279_16.jpg', deleted: false },
        { id: 'xyz456.jpg', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdvHiMePqz1GKwY38h5_Nfx0ga731PEC0l7A&s', deleted: false },
        { id: '1', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdvHiMePqz1GKwY38h5_Nfx0ga731PEC0l7A&s', deleted: false },
        { id: '2', url: 'https://cdn-media.sforum.vn/storage/app/media/anh-dep-83.jpg', deleted: false }
    ];

    let newImages = [];

    function renderImages() {
        const $imageList = $('#image-list');
        $imageList.empty();

        existingImages.forEach((img, idx) => {
            const $div = $('<div class="position-relative image-wrapper" style="min-width: 200px">');
            if (img.deleted) $div.addClass('opacity-50');
            //const btnLabel = img.deleted ? '↺' : 'X';
            const btnLabel = !img.deleted ? '<i class="bi bi-x text-white fw-bold fs-5"></i>' : '<i class="bi bi-arrow-clockwise text-white fw-bold fs-5"></i>';
            const bgLabel = !img.deleted ? 'btn-danger' : 'btn-primary';
            $div.html(`
                <img
                      src="${img.url}"
                      class="img-thumbnail position-absolute top-0 end-0" style="width: 100%; height: 220px;" />
                    <button type="button" class="toggle-delete btn ${bgLabel} rounded-circle py-0 px-1 position-absolute top-0 end-0" data-index="${idx}">
                      ${btnLabel}
                    </button>
        <!--<img src="${img.url}" style="width: 100px">
        <button type="button" class="toggle-delete" data-index="${idx}">${btnLabel}</button>-->
    `);
            $imageList.append($div);
        });

        newImages.forEach((item) => {
            const url = URL.createObjectURL(item.file);
            const $div = $('<div class="position-relative image-wrapper" style="min-width: 200px">');
            if (item.deleted) $div.addClass('opacity-50');
            //const btnLabel = img.deleted ? '↺' : 'X';
            const btnLabel = !item.deleted ? '<i class="bi bi-x text-white fw-bold fs-5"></i>' : '<i class="bi bi-arrow-clockwise text-white fw-bold fs-5"></i>';
            const bgLabel = !item.deleted ? 'btn-danger' : 'btn-primary';
            $div.html(`
                 <img
                      src="${url}"
                      class="img-thumbnail position-absolute top-0 end-0" style="width: 100%; height: 220px;" />
                    <button type="button" class="toggle-delete-new btn ${bgLabel} rounded-circle py-0 px-1 position-absolute top-0 end-0" data-id="${item.id}">
                      ${btnLabel}
                    </button>
        <!--<img src="${url}" style="width: 100px">
        <button type="button" class="toggle-delete-new" data-id="${item.id}">${btnLabel}</button>-->
    `);
            $imageList.append($div);
        });

    }

    $(document).ready(function () {
        renderImages();

        $('#add-image-btn').on('click', function () {
            $('#image-input').click();
        });

        $('#image-input').on('change', function (e) {
            const files = Array.from(e.target.files);
            files.forEach(file => {
                newImages.push({
                    id: Date.now().toString() + Math.random().toString(36).substring(2),
                    file,
                    deleted: false
                });
            });
            renderImages();
        });

        $('#image-list').on('click', '.toggle-delete, .toggle-delete-new', function () {
            const $btn = $(this);
            if ($btn.hasClass('toggle-delete')) {
                const idx = $btn.data('index');
                existingImages[idx].deleted = !existingImages[idx].deleted;

                // Cập nhật nút
                //const btnLabel = img.deleted ? '<i class="bi bi-x text-white fw-bold fs-5"></i>' : '<i class="bi bi-arrow-clockwise text-white fw-bold fs-5"></i>';
                //const bgLabel = img.deleted ? 'btn-danger' : 'btn-primary';

                $btn.html(!existingImages[idx].deleted ? '<i class="bi bi-x text-white fw-bold fs-5"></i>' : '<i class="bi bi-arrow-clockwise text-white fw-bold fs-5"></i>');
                $btn.toggleClass('btn-danger btn-primary');
                // Cập nhật lớp cho phần tử chứa ảnh
                $btn.closest('.image-wrapper').toggleClass('opacity-50', existingImages[idx].deleted);

            } else if ($btn.hasClass('toggle-delete-new')) {
                const id = $btn.data('id');
                const found = newImages.find(item => item.id === id);
                if (found) {
                    found.deleted = !found.deleted;

                    $btn.html(!found.deleted ? '<i class="bi bi-x text-white fw-bold fs-5"></i>' : '<i class="bi bi-arrow-clockwise text-white fw-bold fs-5"></i>');
                     $btn.toggleClass('btn-danger btn-primary');
                    $btn.closest('.image-wrapper').toggleClass('opacity-50', found.deleted);
                }
            }
        });

        $('#form').on('submit', function (e) {
            e.preventDefault();

            const deletedIds = existingImages
                .filter(img => img.deleted)
                .map(img => img.id);

            const formData = new FormData(this);
            formData.set('deleteImages', JSON.stringify(deletedIds));

            newImages
                .filter(item => !item.deleted)
                .forEach((item) => {
                    formData.append('newImages', item.file);
                });


            // $.ajax({
            //     url: '/upload',
            //     type: 'POST',
            //     data: formData,
            //     processData: false,
            //     contentType: false,
            //     success: function (res) {
            //         alert('Upload thành công!');
            //     },
            //     error: function (err) {
            //         alert('Lỗi khi upload');
            //     }
            // });
        });


    });

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

    quillInstances.forEach(({ quill, wrapper }) => {
        if (!wrapper.hasClass('d-none')) {
            const text = quill.getText().trim();
            // Validate...
        }
    });

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



        form.classList.add('was-validated');
    }, false);

    let duration = 0;
    let beforeDuration = 0;

    $('#addTour').click(function () {
        if ($(this).text() == "Thêm tour mới" || $(this).text() == "Lưu tour") {
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

            duration = $('#tourDuration').val();
            if (beforeDuration == 0) {
                // beforeDuration = duration;
                $('#tpMark').show();
            }

            updateTourProgramCard();

        } else if ($(this).text() == "Sửa") {
            $(this).text("Lưu tour");

            tourQuill.forEach(quill => {
                quill.enable(true);
            })

            $('#tourForm').find('input[type="checkbox"]').off('click');

            $('#tourForm').find('input:not([type="file"]), textarea').prop('readonly', false);

            $('#idCategory').off('focus click');

            $('#tourImage').off('click drop keydown');

        }
    })

    function updateTourProgramCard() {
        if (beforeDuration == 0) {
            beforeDuration = 1;
            while (beforeDuration <= duration) {
                addTourProgramCard(beforeDuration);
                beforeDuration++;
            }
        } else if (beforeDuration > duration) {
            $('#tourPrograms .tourProgram').show();

            let index = beforeDuration;
            while (index >= duration) {
                let instance = quillInstances[index];
                if (instance) {
                    instance.wrapper.hide(); // ẩn cả wrapper
                }
                index--;
            }
            // console.log($('#tourPrograms .tourProgram:visible').length+"/");
        } else if (beforeDuration < duration) {
            $('#tourPrograms .tourProgram').show();
            while (beforeDuration <= duration) {
                addTourProgramCard(beforeDuration);
                beforeDuration++;
            }

        }
    }

    function addTourProgramCard(index) {
        console.log(index);
        const editorWrapper = $(`<div class="card tourProgram"></div>`);
        const editorContent = `
            <div class="card-header bg-secondary text-white text-center text-md-start">Ngày <span
                    class="day">${index}</span></div>

                <ul class="list-group list-group-flush">
                  <li class="list-group-item pb-4">
                    <div class="row">
                      <div class="col-md-8 col-sm-12">
                        <div class="form-floating">
                          <input type="text" class="form-control locations" placeholder="Thời điểm lý tưởng">
                          <label>Địa điểm chương trình</label>
                          <div class="invalid-feedback">Độ dài từ 10 ký tự trở lên</div>
                        </div>
                      </div>

                      <div class="col-md-3 col-sm-12 ms-0 meal">
                        <p class="mb-1 pt-1 ps-1 ms-lg-0 ps-lg-0 ps-md-0 ms-md-0">Bữa ăn</p>
                        <div class="d-flex justify-content-md-between justify-content-sm-evenly">
                          <div class="form-check form-check-inline">
                            <label>
                              <input class="form-check-input" type="checkbox" value="Sáng" checked>
                              Sáng
                            </label>

                          </div>
                          <div class="form-check form-check-inline">
                            <label>
                              <input class="form-check-input" type="checkbox" value="Trưa" checked>
                              Trưa
                            </label>

                          </div>
                          <div class="form-check form-check-inline">
                            <label>
                              <input class="form-check-input" type="checkbox" value="Tối" checked>
                              Tối
                            </label>
                          </div>
                        </div>
                      </div>

                      <div class="col-12 mt-2 h-100">
                        <label class="mb-1 tpContent">Nội dung chương trình</label>
                        <!--<div class="quill-editor-2"></div>
                        <div class="invalid-feedback" style="display: none">Độ dài từ 20 ký tự trở lên</div>-->
                      </div>

                    </div>
                  </li>
                </ul>
        `;
        $(editorWrapper).html(editorContent);

        const editorDiv = $('<div class="quill-editor-2"></div>');
        const feedback = $('<div class="invalid-feedback" style="display: none">Độ dài từ 20 ký tự trở lên</div>');

        $(editorWrapper).find('.tpContent').after(editorDiv, feedback);
        $('#tourPrograms').append(editorWrapper);

        const quill = new Quill(editorDiv[0], { theme: 'snow' });

        // Gắn sự kiện validate nếu muốn
        quill.on('text-change', function () {
            const text = quill.getText().trim();
            if (text.length < 20) {
                $(feedback).show();
            } else {
                $(feedback).hide();
            }
        });

        $(editorWrapper).find('.locations').on('input', function () {
            //let flag = /^[\p{L}0-9()[]{} ]{10,}$/u.test($(this).val());
            let flag = /^[\p{L}0-9 ]{3,}.{7,}$/u.test($(this).val());
            $(this).toggleClass('is-invalid', !flag);
            $(this).toggleClass('is-valid', flag);
            // if(!flag) $(this).next().next().text('Ít nhất 10 ký tự và không có ký tự đặc biệt');
        })

        // const $editor = $(`${selector} .ql-editor`);
        // let $feedback = $editor.parent().next('.invalid-feedback');

        // Thêm method validate thủ công cho bên ngoài gọi
        quill.validate = function () {
            const text = quill.getText().trim();
            if (text.length < 20 || !(/^[\p{L}0-9 ]{3,}.{7,}$/u.test($(editorWrapper).find('.locations').val()))) {
                $(editorWrapper).find('.locations').toggleClass('is-invalid');
                $(feedback).show();
                return false;
            } else {
                $(feedback).hide();
                return true;
            }
        };

        // Lưu lại đối tượng
        quillInstances.push({ quill, wrapper: editorWrapper });
    }
})();