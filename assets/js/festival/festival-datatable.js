// (function () {
//     "use strict";

//     /**
//      * Easy selector helper function
//      */
//     const select = (el, all = false) => {
//         el = el.trim()
//         if (all) {
//             return [...document.querySelectorAll(el)]
//         } else {
//             return document.querySelector(el)
//         }
//     }

//     /**
//    * Initiate Datatables
//    */
//     const datatables = select('.datatable', true)
//     datatables.forEach(datatable => {
//         new simpleDatatables.DataTable(datatable, {
//             perPageSelect: [5, 10, 15, ["All", -1]],
//             columns: [{
//                 select: 2,
//                 sortSequence: ["desc", "asc"]
//             },
//             {
//                 select: 3,
//                 sortSequence: ["desc", "asc"]
//             },
//             {
//                 select: 4,
//                 cellClass: "green",
//                 headerClass: "red"
//             }
//             ]
//         });
//     })
// })