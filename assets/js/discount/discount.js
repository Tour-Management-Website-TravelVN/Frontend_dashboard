import { validateLength, validateDiscount } from "../validate.js"

$(function () {

    const toast = new bootstrap.Toast($('#myToast'));
    const addDis = new bootstrap.Modal($('#addDis'));
    const updateDis = new bootstrap.Modal($('#updateDis'));
    const delDis = new bootstrap.Modal($('#staticBackdrop'));
    //toast.show();


    //VALIDATE
    const fields = [
        { selector: '#discountName', validate: (value) => validateLength(value, 10, 255), msg: 'Độ dài nằm trong khoảng 10 đến 255 ký tự' },
        { selector: '#discountName2', validate: (value) => validateLength(value, 10, 255), msg: 'Độ dài nằm trong khoảng 10 đến 255 ký tự' }
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

    $('#discountValue, #discountValue2').on('input', function () {
        let unit = $(this).parent().parent().next().find(".form-select").val();
        let isValid = validateDiscount($(this).val(), unit);
        $(this).toggleClass('is-invalid', !isValid);
        $(this).toggleClass('is-valid', isValid);
        if (!isValid) {
            if (unit == "%") $(this).siblings('.invalid-feedback').text("Từ 1 đến 30");
            else if (unit == "VND") $(this).siblings('.invalid-feedback').text("Ít nhất là 1000");
        }
    })

    $('form .form-select').on('change', function () {
        let $discountValue = $(this).parents('form').find('input[type="number"]');
        let unit = $(this).val();
        console.log(unit);
        let isValid = validateDiscount($discountValue.val(), unit);
        $discountValue.toggleClass('is-invalid', !isValid);
        $discountValue.toggleClass('is-valid', isValid);
        if (!isValid) {
            if (unit == "%") $discountValue.siblings('.invalid-feedback').text("Từ 1 đến 30");
            else if (unit == "VND") $discountValue.siblings('.invalid-feedback').text("Ít nhất là 1000");
        }
    })

    //FORM
    $('#formAdd').on('submit', function (e) {
        e.preventDefault(); // Ngăn submit mặc định

        if (this.checkValidity && validateLength($('#discountName').val(), 10, 255) && validateDiscount($('#discountValue').val(), $(this).find('.form-select').val())) {
            // Gửi form bằng JS hoặc submit thủ công nếu cần
            //this.submit(); // hoặc AJAX

            let discount = {
                discountName: $('#discountName').val().trim(),
                discountValue: parseFloat($('#discountValue').val()),
                discountUnit: $('#discountUnit').val()
            }

            let formData = new FormData();
            formData.append("discount", JSON.stringify(discount));
            console.log(JSON.stringify(discount));

            $.ajax({
                url: '/adv/to/discount?action=add',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (res) {
                    if (res.rs) {
                        //discount : {}
                        // addRow(res.discount);
                        // $('#discountName').val("");
                        // $('#discountValue').val("");
                        // addDis.hide();
                        window.location.href = window.location.href;
                        //$('#formAdd').removeClass('was-validated');
                        //$('#formAdd').find('.is-valid').removeClass('is-valid');
                    } else {
                        displayAlert('Tên chương trình giảm giá đã tồn tại');
                        //$('#formAdd').removeClass('was-validated');
                        //$('#formAdd').find('.is-valid').removeClass('is-valid');
                    }
                },
                error: function (err) {
                    displayAlert("Có lỗi xảy ra");
                }
            });
        } else {
            displayAlert('Hãy kiểm tra lại thông tin nhập vào');
            //$('#formAdd').removeClass('was-validated');
            //$('#formAdd').find('.is-valid').removeClass('is-valid');
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

        if (this.checkValidity && validateLength($('#discountName2').val(), 10, 255) && validateDiscount($('#discountValue2').val(), $(this).find('.form-select').val())) {
            // Gửi form bằng JS hoặc submit thủ công nếu cần
            //this.submit(); // hoặc AJAX
            let discount = {
                id: $('#discountId2').val(),
                discountName: $('#discountName2').val().trim(),
                discountValue: parseFloat($('#discountValue2').val()),
                discountUnit: $('#discountUnit2').val()
            }

            console.log(JSON.stringify(discount));
            console.log("HELLO");

            let formData = new FormData();
            formData.append("discount", JSON.stringify(discount));

            //ERROR
            $.ajax({
                url: '/adv/to/discount?action=update',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (res) {
                    if (res.rs) {
                        //discount : {}
                        //addRow(res.discount);

                        // $('#discountName2').val("");
                        // $('#discountValue2').val("");
                        // updateDis.hide();
                        // displayAlert("Sửa thành công");
                        // let $tr = $(`tbody td[data-id="${discount.id}"]`).parent();
                        // $tr.find('.disName').text(discount.discountName);
                        // $tr.find('.disName').attr('data-name', discount.discountName);
                        // $tr.find('.disValue').text(discount.discountValue + (discount.discountUnit == "%" ? "%" : " VND"));
                        // $tr.find('.disValue').attr('data-value', discount.discountValue);
                        // $tr.find('.disValue').attr('data-unit', discount.discountUnit);

                        window.location.href = window.location.href;

                        //$('#formUpdate').removeClass('was-validated');
                        //$('#formUpdate').find('.is-valid').removeClass('is-valid');
                    } else {
                        displayAlert('Không thể sửa')
                        //$('#formUpdate').removeClass('was-validated');
                        //$('#formUpdate').find('.is-valid').removeClass('is-valid');
                    }
                },
                error: function (err) {
                    displayAlert("Có lỗi xảy ra");
                }
            });
        } else {
            displayAlert("Kiểm tra lại dữ liệu nhập");
            //$('#formUpdate').removeClass('was-validated');
            //$('#formUpdate').find('.is-valid').removeClass('is-valid');
        }
        $('#formUpdate').removeClass('was-validated');
        $('#formUpdate').find('.is-valid').removeClass('is-valid');
    });

    $('table').on('click', '.btnDel', function () {
        let disName = $(this).closest('tr').find('.disName').text().trim();
        let disId = $(this).closest('tr').find('.disId').text().trim();
        //console.log('disName:', disName, 'disId:', disId);

        $.ajax({
            url: '/adv/to/discount',
            type: 'GET',
            data: {
                check: true,
                discountid: disId
            },
            success: function (res) {
                if (!res.check) {
                    //discount : {}
                    delDis.hide();
                    displayAlert('Không thể xóa');
                } else {
                    delDis.show();
                }
            },
            error: function (err) {
                displayAlert("Có lỗi xảy ra");
            }
        });

        $('#staticBackdrop .modal-body').text("Bạn có muốn xóa " + disName);

        $('#btnDelete').off('click').on('click', function () {
            console.log('Click btnDelete with disId:', disId);
            // Thêm đoạn code xóa hoặc xử lý ở đây
            $.ajax({
                url: '/adv/to/discount',
                type: 'POST',
                data: {
                    action: 'del',
                    discountid: disId
                },
                success: function (res) {
                    if (res.rs) {
                        //discount : {}
                        delDis.hide();
                        displayAlert('Xóa thành công');
                        $(`tbody td[data-id="${disId}"]`).parent().remove();
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

    $('table').on('click', '.btnUpdate', function () {
        let disId = $(this).closest('tr').find('.disId').data('id');
        let disName = $(this).closest('tr').find('.disName').data('name');
        let disValue = $(this).closest('tr').find('.disValue').data('value');
        let disUnit = $(this).closest('tr').find('.disValue').data('unit');
        //console.log('disName:', disName, 'disId:', disId);
        //updateDis.show();
        $.ajax({
            url: '/adv/to/discount',
            type: 'GET',
            data: {
                check: true,
                discountid: disId
            },
            success: function (res) {
                if (!res.check) {
                    //discount : {}
                    updateDis.hide();
                    displayAlert('Không thể sửa');
                } else {
                    updateDis.show();
                }
            },
            error: function (err) {
                displayAlert("Có lỗi xảy ra");
            }
        });

        $('#discountId2').val(disId);
        $('#discountName2').val(disName);
        $('#discountValue2').val(disValue);
        $('#discountUnit2').val(disUnit);
    });

    /**
   * Initiate Datatables
   */
    // $('.datatableDis').each(function () {
    //     new simpleDatatables.DataTable(this, {
    //         labels: {
    //             info: "Hiển thị {start} đến {end} / {rows} dòng",
    //             noRows: "Không có dữ liệu"
    //         },
    //         perPageSelect: [5, 10, 15, ["All", -1]],
    //         columns: [
    //             { select: 2, sortSequence: ["desc", "asc"] },
    //             { select: 3, sortSequence: ["desc", "asc"] }
    //         ]
    //     });
    // });

    // let dataTableInstance;

    function initDataTable() {
        if (dataTableInstance) {
            dataTableInstance.destroy(); // Xoá instance cũ nếu có
        }

        dataTableInstance = new simpleDatatables.DataTable(document.querySelector('.datatableDis'), {
            labels: {
                info: "Hiển thị {start} đến {end} / {rows} dòng",
                noRows: "Không có dữ liệu"
            },
            perPageSelect: [5, 10, 15, ["All", -1]],
            columns: [
                { select: 2, sortSequence: ["desc", "asc"] },
                { select: 3, sortSequence: ["desc", "asc"] }
            ]
        });
    }

    //initDataTable();

    // $('#page').on('change', function () {
    //     console.log($('#page').val());
    //     const tr = $('<tr></tr>');
    //     tr.html(`
    //         <td class="disId">1</td>
    //             <td class="disName">Giảm giá 80%</td>
    //             <td align="center" class="text-justify" class="disValue">
    //                   80%</td>
    //             <!-- <td align="center">
    //                   %
    //             </td> -->
    //             <td class="d-flex justify-content-evenly" data-order="null" data-search="null">
    //                 <button type="button" class="btn btn-primary" data-bs-toggle="modal"
    //                     data-bs-target="#updateDis"><i class="bi bi-pencil-fill"></i></button>
    //                 <button type="button" class="btn btn-danger btnDel" data-bs-toggle="modal" 
    //                     data-bs-target="#staticBackdrop"><i class="bi bi-trash3-fill"></i></button>
    //         </td>
    //     `);
    //     $('tbody').prepend(tr);
    //     initDataTable();
    // })

    let dataTableInstance;

    initDataTable();

    /*
    function displayAlert(msg) {
        $('.toast-body').text(msg);
        toast.show();
    }

    function initDataTable() {
        if (dataTableInstance) {
            dataTableInstance.destroy(); // Xoá bảng cũ
            $('.datatable-wrapper').remove(); // Xoá HTML đã được wrap tự động
            $('.datatableDis').unwrap(); // Xoá wrapper nếu có
        }

        dataTableInstance = new simpleDatatables.DataTable(document.querySelector('.datatableDis'), {
            labels: {
                info: "Hiển thị {start} đến {end} / {rows} dòng",
                noRows: "Không có dữ liệu"
            },
            perPageSelect: [5, 10, 15, ["All", -1]],
            columns: [
                { select: 2, sortSequence: ["desc", "asc"] },
                { select: 3, sortSequence: ["desc", "asc"] }
            ]
        });

        $('#formAdd').on('submit', function (e) {
            e.preventDefault(); // Ngăn submit mặc định

            if (this.checkValidity && validateLength($('#discountName').val(), 10, 255) && validateDiscount($('#discountValue').val(), $(this).find('.form-select').val())) {
                // Gửi form bằng JS hoặc submit thủ công nếu cần
                //this.submit(); // hoặc AJAX

                let discount = {
                    discountName: $('#discountName').val().trim(),
                    discountValue: parseFloat($('#discountValue').val()),
                    discountUnit: $('#discountUnit').val()
                }

                let formData = new FormData();
                formData.append("discount", JSON.stringify(discount));
                console.log(JSON.stringify(discount));

                $.ajax({
                    url: '/adv/to/discount?action=add',
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (res) {
                        if (res.rs) {
                            //discount : {}
                            addRow(res.discount);
                            $('#discountName').val("");
                            $('#discountValue').val("");
                            addDis.hide();
                            //$('#formAdd').removeClass('was-validated');
                            //$('#formAdd').find('.is-valid').removeClass('is-valid');
                        } else {
                            displayAlert('Tên chương trình giảm giá đã tồn tại');
                            //$('#formAdd').removeClass('was-validated');
                            //$('#formAdd').find('.is-valid').removeClass('is-valid');
                        }
                    },
                    error: function (err) {
                        displayAlert("Có lỗi xảy ra");
                    }
                });
            } else {
                displayAlert('Hãy kiểm tra lại thông tin nhập vào');
                //$('#formAdd').removeClass('was-validated');
                //$('#formAdd').find('.is-valid').removeClass('is-valid');
            }
            $('#formAdd').removeClass('was-validated');
            $('#formAdd').find('.is-valid').removeClass('is-valid');
        });

        $('#formUpdate').on('submit', function (e) {
            e.preventDefault(); // Ngăn submit mặc định

            if (this.checkValidity && validateLength($('#discountName2').val(), 10, 255) && validateDiscount($('#discountValue2').val(), $(this).find('.form-select').val())) {
                // Gửi form bằng JS hoặc submit thủ công nếu cần
                //this.submit(); // hoặc AJAX
                let discount = {
                    id: $('#discountId2').val(),
                    discountName: $('#discountName2').val().trim(),
                    discountValue: parseFloat($('#discountValue2').val()),
                    discountUnit: $('#discountUnit2').val()
                }

                console.log(JSON.stringify(discount));
                console.log("HELLO");

                let formData = new FormData();
                formData.append("discount", JSON.stringify(discount));

                //ERROR
                $.ajax({
                    url: '/adv/to/discount?action=update',
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (res) {
                        if (res.rs) {
                            //discount : {}
                            //addRow(res.discount);
                            $('#discountName2').val("");
                            $('#discountValue2').val("");
                            updateDis.hide();
                            displayAlert("Sửa thành công");
                            let $tr = $(`tbody td[data-id="${discount.id}"]`).parent();
                            $tr.find('.disName').text(discount.discountName);
                            $tr.find('.disName').attr('data-name', discount.discountName);
                            $tr.find('.disValue').text(discount.discountValue + (discount.discountUnit == "%" ? "%" : " VND"));
                            $tr.find('.disValue').attr('data-value', discount.discountValue);
                            $tr.find('.disValue').attr('data-unit', discount.discountUnit);

                            refreshAfterUpdate();
                            //$('#formUpdate').removeClass('was-validated');
                            //$('#formUpdate').find('.is-valid').removeClass('is-valid');
                        } else {
                            displayAlert('Không thể sửa')
                            //$('#formUpdate').removeClass('was-validated');
                            //$('#formUpdate').find('.is-valid').removeClass('is-valid');
                        }
                    },
                    error: function (err) {
                        displayAlert("Có lỗi xảy ra");
                    }
                });
            } else {
                displayAlert("Kiểm tra lại dữ liệu nhập");
                //$('#formUpdate').removeClass('was-validated');
                //$('#formUpdate').find('.is-valid').removeClass('is-valid');
            }
            $('#formUpdate').removeClass('was-validated');
            $('#formUpdate').find('.is-valid').removeClass('is-valid');
        });

        $('table').on('click', '.btnDel', function () {
            let disName = $(this).closest('tr').find('.disName').text().trim();
            let disId = $(this).closest('tr').find('.disId').text().trim();
            //console.log('disName:', disName, 'disId:', disId);

            $.ajax({
                url: '/adv/to/discount',
                type: 'GET',
                data: {
                    check: true,
                    discountid: disId
                },
                success: function (res) {
                    if (!res.check) {
                        //discount : {}
                        delDis.hide();
                        displayAlert('Không thể xóa');
                    } else {
                        delDis.show();
                    }
                },
                error: function (err) {
                    displayAlert("Có lỗi xảy ra");
                }
            });

            $('#staticBackdrop .modal-body').text("Bạn có muốn xóa " + disName);

            $('#btnDelete').off('click').on('click', function () {
                console.log('Click btnDelete with disId:', disId);
                // Thêm đoạn code xóa hoặc xử lý ở đây
                $.ajax({
                    url: '/adv/to/discount',
                    type: 'POST',
                    data: {
                        action: 'del',
                        discountid: disId
                    },
                    success: function (res) {
                        if (res.rs) {
                            //discount : {}
                            delDis.hide();
                            displayAlert('Xóa thành công');
                            $(`tbody td[data-id="${disId}"]`).parent().remove();
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

        $('table').on('click', '.btnUpdate', function () {
            let disId = $(this).closest('tr').find('.disId').data('id');
            let disName = $(this).closest('tr').find('.disName').data('name');
            let disValue = $(this).closest('tr').find('.disValue').data('value');
            let disUnit = $(this).closest('tr').find('.disValue').data('unit');
            //console.log('disName:', disName, 'disId:', disId);
            //updateDis.show();
            $.ajax({
                url: '/adv/to/discount',
                type: 'GET',
                data: {
                    check: true,
                    discountid: disId
                },
                success: function (res) {
                    if (!res.check) {
                        //discount : {}
                        updateDis.hide();
                        displayAlert('Không thể sửa');
                    } else {
                        updateDis.show();
                    }
                },
                error: function (err) {
                    displayAlert("Có lỗi xảy ra");
                }
            });

            $('#discountId2').val(disId);
            $('#discountName2').val(disName);
            $('#discountValue2').val(disValue);
            $('#discountUnit2').val(disUnit);
        });
    }

    function refreshAfterUpdate() {
        $('table').on('click', '.btnUpdate', function () {
            let disId = $(this).closest('tr').find('.disId').data('id');
            let disName = $(this).closest('tr').find('.disName').data('name');
            let disValue = $(this).closest('tr').find('.disValue').data('value');
            let disUnit = $(this).closest('tr').find('.disValue').data('unit');
            //console.log('disName:', disName, 'disId:', disId);
            //updateDis.show();
            $.ajax({
                url: '/adv/to/discount',
                type: 'GET',
                data: {
                    check: true,
                    discountid: disId
                },
                success: function (res) {
                    if (!res.check) {
                        //discount : {}
                        updateDis.hide();
                        displayAlert('Không thể sửa');
                    } else {
                        updateDis.show();
                    }
                },
                error: function (err) {
                    displayAlert("Có lỗi xảy ra");
                }
            });

            $('#discountId2').val(disId);
            $('#discountName2').val(disName);
            $('#discountValue2').val(disValue);
            $('#discountUnit2').val(disUnit);
        });
    }
    */

    $('#page').on('change', function () {
        // console.log($('#page').val());
        window.location.href = $('#page').val();
    });

    function addRow(discount) {
        // Xoá instance cũ trước khi thêm dòng
        if (dataTableInstance) {
            dataTableInstance.destroy();
            $('.datatable-wrapper').remove(); // clean up HTML thêm vào
            $('.datatableDis').unwrap(); // xoá wrapper nếu có
        }

        let unit = "%";
        if (discount.discountUnit == "VND") unit = " VND";

        // Thêm dòng mới vào tbody
        const tr = $(`
    <tr>
      <td class="disId" data-id='${discount.id}'>${discount.id}</td>
      <td class="disName" data-name='${discount.discountName}'>${discount.discountName}</td>
      <td align="center" class="text-justify disValue" data-value='${discount.discountValue}' data-unit='${discount.discountUnit}'>${discount.discountValue}${unit}</td>
      <td class="d-flex justify-content-evenly" data-order="null" data-search="null">
        <button type="button" class="btn btn-primary"><i class="bi bi-pencil-fill"></i></button>
        <button type="button" class="btn btn-danger btnDel"><i class="bi bi-trash3-fill"></i></button>
      </td>
    </tr>
  `);

        $('.datatableDis tbody').append(tr);

        // Khởi tạo lại bảng
        initDataTable();
    }
})