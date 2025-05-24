(function () {
    'use strict'

    let existingImages = [
        // { id: 'abc123.jpg', url: 'https://baodongnai.com.vn/file/e7837c02876411cd0187645a2551379f/dataimages/201706/original/images1920558_4053279_16.jpg', deleted: false },
        // { id: 'xyz456.jpg', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdvHiMePqz1GKwY38h5_Nfx0ga731PEC0l7A&s', deleted: false },
        // { id: '1', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdvHiMePqz1GKwY38h5_Nfx0ga731PEC0l7A&s', deleted: false },
        // { id: '2', url: 'https://cdn-media.sforum.vn/storage/app/media/anh-dep-83.jpg', deleted: false }
    ];

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
    `);
            $imageList.append($div);
        });

    }

    $(document).ready(function () {
        // let existingImages2 = [
        //     { id: 'abc123.jpg', url: 'https://baodongnai.com.vn/file/e7837c02876411cd0187645a2551379f/dataimages/201706/original/images1920558_4053279_16.jpg', deleted: false },
        //     { id: 'xyz456.jpg', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdvHiMePqz1GKwY38h5_Nfx0ga731PEC0l7A&s', deleted: false },
        //     { id: '1', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdvHiMePqz1GKwY38h5_Nfx0ga731PEC0l7A&s', deleted: false },
        //     { id: '2', url: 'https://cdn-media.sforum.vn/storage/app/media/anh-dep-83.jpg', deleted: false }
        // ];
        // // Lưu dữ liệu (cần stringify)
        // localStorage.setItem('updateImgsTour', JSON.stringify(existingImages2));

        // Lấy dữ liệu (cần parse lại)
        // GÁN lại chứ không khai báo lại
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

                // Cập nhật nút
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

        $('#addTour').click(function () {
            let isValidForm = validateForm1;
            console.log("IT'S ME");
            console.log(isValidForm());

            if (!isValidForm()) {
                const myModal = new bootstrap.Modal($('#finalModal'));
                myModal.show();
                $('#tourForm').addClass("was-validated");
                return;
            }

            submitForm();
        })
    });



    function validateForm1() {
        let isValidForm = true;

        const hasExistingImage = existingImages.some(img => !img.deleted);
        const hasNewImage = newImages.some(img => !img.deleted);

        isValidForm = hasExistingImage || hasNewImage;

        console.log(isValidForm);

        if ($('#tourId').val().trim() < 12) isValidForm = false;

        return isValidForm;
    }

    function submitForm() {
        const formData = new FormData();

        newImages
            .filter(item => !item.deleted)
            .map(item => item.file)
            .forEach(file => formData.append('newImages', file));

        const delImages = existingImages
            .filter(item => item.deleted)
            .map(item => item.id).join(",");

        formData.append('delImages', delImages);

        // formData.append('tourId', $('#tourId').val().trim());

        let tourId = $('#tourId').val().trim();

        $.ajax({
            url: '/adv/to/tour/tour_form?action=updateImgs&tourid='+encodeURIComponent(tourId),
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

})();