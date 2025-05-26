import { validateTourName, validateDuration, validateInfoTour } from "../validate.js";

(function () {
    'use strict'

    let existingImages = [];

    let newImages = [];

    function renderImages() {
        const $imageList = $('#image-list');
        $imageList.empty();

        existingImages.forEach((img, idx) => {
            const $div = $('<div class="position-relative image-wrapper" style="min-width: 200px">');
            if (img.deleted) $div.addClass('opacity-50');
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
        restoreTourPrograms(JSON.parse(localStorage.getItem("tourPrograms")));
        localStorage.removeItem("tourPrograms");
        quillDescription.root.innerHTML = JSON.parse(localStorage.getItem("description"));
        quillIncluded.root.innerHTML = JSON.parse(localStorage.getItem("inclusion"));
        quillNotIncluded.root.innerHTML = JSON.parse(localStorage.getItem("exclusion"));
        localStorage.removeItem("description");
        localStorage.removeItem("inclusion");
        localStorage.removeItem("exclusion");

        loadFormFromLocalStorage();
        const fromStorage = localStorage.getItem('updateImgsTour');
        if (fromStorage) {
            existingImages = JSON.parse(fromStorage);
        }

        // console.log(existingImages)

        // Xoá key (chỉ cần tên key thôi)
        localStorage.removeItem('updateImgsTour');

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

        $('#btnExit').click(function () {
            localStorage.removeItem("tourFormDraft2");
            // const params = new URLSearchParams(window.location.search);
            // const tourId = params.get('tourId'); // nếu URL có ?tourId=123
            window.location.href = "/adv/to/tour_detail?tourid="+encodeURIComponent($("#tourId").val());
        })
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


    // const waitForQuill = setInterval(() => {
    //     if (quillDescription && quillIncluded && quillNotIncluded) {
    //         clearInterval(waitForQuill);
    //         loadFormFromLocalStorage();
    //     }
    // }, 1000); // Kiểm tra mỗi 100ms

    const loadFormFromLocalStorage = () => {
        const saved = localStorage.getItem('tourFormDraft2');
        if (!saved) {
            $('#btnClear').hide();
            return;
        };

        const data = JSON.parse(saved);
        const tour = data.tour;

        if ($('#tourId').val() != tour.tourId) {
            $('#btnClear').hide();
            return;
        };

        $('#btnClear').click(function(){
            localStorage.removeItem("tourFormDraft2");
            let tourid = $('#tourId').val();
            window.location.href = "/adv/to/tour/tour_form?action=update&tourid="+encodeURIComponent(tourid);
        })

        $('#tourId').val(tour.tourId);
        $('#tourName').val(tour.tourName);
        $('#tourDuration').val(tour.duration);
        $('#tourTarget').val(tour.targetAudience);
        $('#tourDeparture').val(tour.departurePlace);
        $('#tourAttractions').val(tour.placesToVisit);
        $('#tourCuisine').val(tour.cuisine);
        $('#tourIdealTime').val(tour.idealTime);
        quillDescription.root.innerHTML = tour.description;
        quillIncluded.root.innerHTML = tour.inclusions;
        quillNotIncluded.root.innerHTML = tour.exclusions;

        $('#idCategory').val(data.categoryId);

        // Xóa các chương trình cũ nếu cần
        $('#programContainer').empty();

        restoreTourPrograms(data.tourPrograms);
    };

    const restoreTourPrograms = (tourPrograms) => {
        // Xóa hết hiện tại
        $('#tourPrograms').empty();
        quillInstances.length = 0;
        beforeDuration = 0;

        tourPrograms.forEach((program, index) => {
            const dayIndex = program.day;

            if (dayIndex != null) $('#tpMark').show();

            // Gọi hàm tạo mới
            addTourProgramCard(dayIndex);
            beforeDuration++;

            const wrapper = $('#tourPrograms .tourProgram').last(); // DOM phần tử vừa tạo

            wrapper.attr("data-tpi", program.id);

            // Gán địa điểm
            wrapper.find('.locations').val(program.locations);

            // Gán bữa ăn
            const selectedMeals = [];
            if (program.mealDescription.includes("Sáng")) selectedMeals.push("Sáng");
            if (program.mealDescription.includes("Trưa")) selectedMeals.push("Trưa");
            if (program.mealDescription.includes("Tối")) selectedMeals.push("Tối");

            wrapper.find('input[type="checkbox"]').each(function () {
                const meal = $(this).val();
                $(this).prop('checked', selectedMeals.includes(meal));
            });

            //  Đợi Quill khởi tạo xong rồi mới gán nội dung
            setTimeout(() => {
                const instance = quillInstances.find(qi =>
                    qi.wrapper.find('.day').text().trim() === String(dayIndex)
                );
                if (instance) {
                    instance.quill.root.innerHTML = program.desciption;
                    console.log(` Đã gán nội dung cho ngày ${dayIndex}`);
                } else {
                    console.warn(` Không tìm thấy Quill instance cho ngày ${dayIndex}`);
                }
            }, 100); // có thể tăng thời gian nếu cần
        });
    };


    const saveFormToLocalStorage = () => {
        const vehicle = $('input[name="vehicle"]:checked')
            .map(function () {
                return $(this).val();
            }).get().join(', ');

        const tour = {
            tourId: $("#tourId").val().trim(),
            tourName: $('#tourName').val().trim(),
            duration: $('#tourDuration').val().trim(),
            vehicle: vehicle,
            targetAudience: $('#tourTarget').val(),
            departurePlace: $('#tourDeparture').val(),
            placesToVisit: $('#tourAttractions').val(),
            cuisine: $('#tourCuisine').val(),
            idealTime: $("#tourIdealTime").val(),
            description: quillDescription.root.innerHTML,
            inclusions: quillIncluded.root.innerHTML,
            exclusions: quillNotIncluded.root.innerHTML
        };

        const tourPrograms = [];
        quillInstances.forEach(({ quill, wrapper }) => {
            if (wrapper.is(":visible")) {
                const meals = wrapper.find(':checkbox:checked')
                    .map(function () {
                        return $(this).val();
                    }).get();
                const mealDescription = meals.length > 0 ? meals.length + " bữa ăn (" + meals.join(", ") + ")" : "Các bữa ăn tự chuẩn bị";
                const tourProgram = {
                    id: parseInt(wrapper.attr('data-tpi')),
                    locations: wrapper.find('.locations').val().trim(),
                    day: parseInt(wrapper.find('.day').text()),
                    mealDescription: mealDescription,
                    desciption: quill.root.innerHTML
                };
                tourPrograms.push(tourProgram);
            }
        });

        const saveObject = {
            tour,
            categoryId: $('#idCategory').val(),
            tourPrograms
        };

        localStorage.setItem('tourFormDraft2', JSON.stringify(saveObject));
    };

    //Gọi autoSave mỗi 5 giây
    setInterval(saveFormToLocalStorage, 5000);

    let flag = false;
    $('#vehicle input[type="checkbox"]').on("change", function () {
        flag = $('#vehicle input[type="checkbox"]:checked').length == 0;
        $('#vehicle input[type="checkbox"]').toggleClass('is-invalid', flag);
        $('#vehicle input[type="checkbox"]').toggleClass('is-valid', !flag);
        $('#vehicle').find('div').last().toggleClass('d-none', !flag);
        $('#vehicle').find('div').last().toggleClass('d-block', flag);
        if (flag) $('#vehicle').find('div').last().text("Chọn ít nhất 1 phương tiện.");
    })

    let duration = 0;
    let beforeDuration = 0;

    let finalFlag = false;
    $('#unlockAll').hide();

    $('#addTour').click(function () {
        if ($(this).text() == "Thêm tour mới" || $(this).text() == "Lưu tour") {
            let isValidForm = validateForm1;

            if (!isValidForm()) {
                $('#tourForm').addClass("was-validated");

                quillInstances.forEach(({ quill, wrapper }) => {
                    if (wrapper.is(":visible")) quill.validate();
                })

                return;
            }

            lockUI1();

            $(this).text("Sửa");

            duration = $('#tourDuration').val();
            if (beforeDuration == 0) {
                // beforeDuration = duration;
                $('#tpMark').show();
            }

            updateTourProgramCard();

        } else if ($(this).text() == "Sửa") {
            $(this).text("Lưu tour");

            unlockUI1();

        }
    })

    function validateForm1() {
        let isValidForm = true;
        fields.forEach(field => {
            const $input = $(field.selector);
            if (!validateField($input, field.validate($input.val()), field.message)) {
                isValidForm = false;
            }
        });

        const hasExistingImage = existingImages.some(img => !img.deleted);
        const hasNewImage = newImages.some(img => !img.deleted);

        isValidForm = hasExistingImage || hasNewImage;

        console.log(isValidForm);

        tourQuill.forEach(quill => {
            if (!quill.validate()) isValidForm = false;
        })


        return isValidForm && !flag;
    }

    function validateForm2() {
        let isValidForm = true;

        quillInstances.forEach(({ quill, wrapper }) => {
            if (wrapper.is(":visible")) {
                if (!quill.validate()) isValidForm = false;
            }
        });

        return isValidForm;
    }



    $('#saveAll').click(function () {
        console.log(validateForm1());
        console.log(validateForm2());
        if (validateForm1() && validateForm2()) {
            lockUI1();
            lockUI2();

            console.log(finalFlag);
            if (!finalFlag) {
                const myModal = new bootstrap.Modal($('#finalModal'));
                myModal.show();
                $('#unlockAll').show();
                finalFlag = true;
                $('#addTour').click();
            } else {
                submitForm();
            }
        } else {
            const myModal = new bootstrap.Modal($('#finalModal'));
            myModal.show();

        }
    })

    $("#unlockAll").click(function () {
        finalFlag = false;
        unlockUI1();
        unlockUI2();
    })

    function submitForm() {
        const formData = new FormData();
        let vehicle = $('input[name="vehicle"]:checked')
            .map(function () {
                return $(this).val();
            }).get().join(', ');

        const tour = {
            "tourId": $('#tourId').val().trim(),
            "tourName": $('#tourName').val().trim(),
            "duration": $('#tourDuration').val().trim(),
            "vehicle": vehicle,
            "targetAudience": $('#tourTarget').val(),
            "departurePlace": $('#tourDeparture').val(),
            "placesToVisit": $('#tourAttractions').val(),
            "cuisine": $('#tourCuisine').val(),
            "idealTime": $("#tourIdealTime").val(),
            "description": quillDescription.root.innerHTML,
            "inclusions": quillIncluded.root.innerHTML,
            "exclusions": quillNotIncluded.root.innerHTML
        }

        newImages
            .filter(item => !item.deleted)
            .map(item => item.file)
            .forEach(file => formData.append('newImages', file));

        const delImages = existingImages
            .filter(item => item.deleted)
            .map(item => item.id).join(",");

        formData.append('delImages', delImages);

        formData.append('tour', JSON.stringify(tour));
        formData.append("categoryId", $('#idCategory').val());

        const tourPrograms = [];
        quillInstances.forEach(({ quill, wrapper }) => {
            if (wrapper.is(":visible")) {
                const meals = wrapper.find(':checkbox:checked')
                    .map(function () {
                        return $(this).val();
                    }).get();
                const mealDescription = meals.length > 0 ? meals.length + " bữa ăn (" + meals.join(", ") + ")" : "Các bữa ăn tự chuẩn bị";
                const tourProgram = {
                    "id": parseInt(wrapper.attr("data-tpi")),
                    "locations": wrapper.find('.locations').val().trim(),
                    "day": parseInt(wrapper.find('.day').text()),
                    "mealDescription": mealDescription,
                    "desciption": quill.root.innerHTML

                }
                tourPrograms.push(tourProgram);
            }
        });

        formData.append("tourPrograms", JSON.stringify(tourPrograms));

        console.log(JSON.stringify(tour));
        console.log(JSON.stringify(tourPrograms));


        $.ajax({
            url: '/adv/to/tour/tour_form?action=update&tourid='+encodeURIComponent($('#tourId').val()),
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (res) {
                if (res.redirect) {
                    window.location.href = res.redirect;
                } else {
                    alert(res.text);
                }
            },
            error: function (err) {
                alert('Lỗi khi upload');
            }
        });
    }

    function lockUI1() {
        $('#image-input').on('click drop keydown', function (e) {
            e.preventDefault();
        });

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

        $('#image-input').addClass('bg-light');

        $('#image-list').find('button').prop('disabled', true);

    }

    function lockUI2() {
        quillInstances.forEach(item => {
            item.quill.enable(false);
        })

        $('#tourPrograms').find('input[type="checkbox"]').on('click', function (e) {
            e.preventDefault();
        })
        $('#tourPrograms').find('input:not([type="file"]), textarea').prop('readonly', true);

        $('#addTour').prop('disabled', true);
    }

    function unlockUI1() {
        tourQuill.forEach(quill => {
            quill.enable(true);
        })

        $('#tourForm').find('input[type="checkbox"]').off('click');

        $('#tourForm').find('input:not([type="file"]), textarea').prop('readonly', false);
        $('#tourId').prop('readonly', true);
        $('#tourDeparture').prop('readonly', true);
        $('#tourAttractions').prop('readonly', true);

        $('#idCategory').off('focus click');

        //$('#tourImage').off('click drop keydown');
        $('#image-input').off('click drop keydown');


        $('#image-list').find('button').prop('disabled', false);
    }

    function unlockUI2() {
        quillInstances.forEach(item => {
            item.quill.enable(true);
        })

        $('#tourPrograms').find('input[type="checkbox"]').off('click');
        $('#tourForm').find('input:not([type="file"]), textarea').prop('readonly', false);

        $('#addTour').prop('disabled', false);
    }

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
        const editorWrapper = $(`<div class="card tourProgram" data-tpi=""></div>`);
        const editorContent = `
            <div class="card-header bg-secondary text-white text-center text-md-start">Ngày <span
                    class="day">${index}</span></div>

                <ul class="list-group list-group-flush">
                  <li class="list-group-item pb-4">
                    <div class="row">
                      <div class="col-md-8 col-sm-12">
                        <div class="form-floating">
                          <input type="text" class="form-control locations" placeholder="Thời điểm lý tưởng" required>
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

        const quill = new Quill(editorDiv[0], {
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
                $(editorWrapper).find('.locations').toggleClass('is-invalid', true);
                $(feedback).show();
                return false;
            } else {
                $(editorWrapper).find('.locations').toggleClass('is-invalid', false);
                $(feedback).hide();
                return true;
            }
        };

        // Lưu lại đối tượng
        quillInstances.push({ quill, wrapper: editorWrapper });
    }


})();