// function createQuillEditor() {
    //     const editorWrapper = $('<div class="quill-wrapper mb-3"></div>');
    //     const editorDiv = $('<div class="quill-editor-2"></div>');
    //     const feedback = $('<div class="invalid-feedback" style="display: none">Nội dung quá ngắn</div>');

    //     editorWrapper.append(editorDiv).append(feedback);
    //     $('#quill-container').append(editorWrapper);

    //     const quill = new Quill(editorDiv[0], { theme: 'snow' });

    //     // Gắn sự kiện validate nếu muốn
    //     quill.on('text-change', function () {
    //         const text = quill.getText().trim();
    //         if (text.length < 10) {
    //             feedback.show();
    //         } else {
    //             feedback.hide();
    //         }
    //     });

    //     // Lưu lại đối tượng
    //     quillInstances.push({ quill, wrapper: editorWrapper });
    // }

    // function removeLastQuillEditor() {
    //     if (quillInstances.length > 0) {
    //         const last = quillInstances.pop();
    //         last.wrapper.remove(); // xóa cả DOM chứa editor
    //         // Không cần gọi .destroy vì Quill chưa hỗ trợ chính thức, remove DOM là đủ
    //     }
    // }

    // Gắn sự kiện nút
    // $('#btn-add').on('click', createQuillEditor);
    // $('#btn-remove').on('click', removeLastQuillEditor);

     // function hideQuillEditor(index) {
    //     const instance = quillInstances[index];
    //     if (instance) {
    //         instance.wrapper.hide(); // ẩn cả wrapper
    //     }
    // }

    // function showQuillEditor(index) {
    //     const instance = quillInstances[index];
    //     if (instance) {
    //         instance.wrapper.show();
    //     }
    // }

     // document.querySelectorAll('.quill-editor-2').forEach(function (el) {
    //     const quill = new Quill(el, {
    //         modules: {
    //             toolbar: [
    //                 [{ font: [] }, { size: [] }],
    //                 ['bold', 'italic', 'underline', 'strike'],
    //                 [{ color: [] }, { background: [] }],
    //                 [{ script: 'super' }, { script: 'sub' }],
    //                 [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    //                 ['direction', { align: [] }],
    //                 ['link', 'image', 'video'],
    //                 ['clean']
    //             ]
    //         },
    //         theme: 'snow'
    //     });

    //     el.__quill = quill;
    // });

    // const includedContent = quillIncluded.getText().trim(); // Lấy text, không phải HTML

        // // const content = tinymce.get("quill-included").getContent();

        // document.querySelectorAll('.quill-editor-2').forEach(function (el, index) {
        //     const quill = el.__quill;
        //     if (quill) {
        //         const contentHtml = quill.root.innerHTML; // Lấy HTML
        //         const contentText = quill.getText();       // Lấy plain text
        //         console.log(`Editor ${index + 1} (HTML):`, contentHtml);
        //         console.log(`Editor ${index + 1} (Text):`, contentText);
        //     } else {
        //         console.log("HELLO2");
        //     }
        // });

        // // Nếu nội dung trống
        // if (includedContent === '') {
        //     event.preventDefault();
        //     event.stopPropagation();

        //     // Hiển thị lỗi
        //     document.getElementById('quill-included').classList.add('is-invalid');

        //     // Nếu chưa có div hiển thị lỗi thì thêm
        //     if (!document.querySelector('#quill-included + .invalid-feedback')) {
        //         const error = document.createElement('div');
        //         error.className = 'invalid-feedback d-block';
        //         error.innerText = 'Vui lòng nhập thông tin đã bao gồm.';
        //         document.getElementById('quill-included').after(error);
        //     }

        // } else {
        //     // Xóa lỗi nếu có
        //     document.getElementById('quill-included').classList.remove('is-invalid');
        //     const feedback = document.querySelector('#quill-included + .invalid-feedback');
        //     if (feedback) feedback.remove();
        // }

        // function createQuillEditor() {
    //     const editorWrapper = $('<div class="quill-wrapper mb-3"></div>');
    //     const editorDiv = $('<div class="quill-editor-2"></div>');
    //     const feedback = $('<div class="invalid-feedback" style="display: none">Nội dung quá ngắn</div>');

    //     editorWrapper.append(editorDiv).append(feedback);
    //     $('#quill-container').append(editorWrapper);

    //     const quill = new Quill(editorDiv[0], { theme: 'snow' });

    //     // Gắn sự kiện validate nếu muốn
    //     quill.on('text-change', function () {
    //         const text = quill.getText().trim();
    //         if (text.length < 10) {
    //             feedback.show();
    //         } else {
    //             feedback.hide();
    //         }
    //     });

    //     // Lưu lại đối tượng
    //     quillInstances.push({ quill, wrapper: editorWrapper });
    // }