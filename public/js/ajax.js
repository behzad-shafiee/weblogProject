


$('#btn-update').click(function (e) {
    e.preventDefault();
    const modalUupdate = $('#modal-update');
    modalUupdate.css({
        'display': 'flex'
    });
});

$('#close-update').click(function (e) {
    e.preventDefault();
    const modalUupdate = $('#modal-update');
    modalUupdate.css({
        'display': 'none'
    });
});




$('#btn-creat-article').click(function (e) {
    e.preventDefault();
    const modalCreatArticle = $('#modal-creatArticle');
    modalCreatArticle.css({
        'display': 'flex'
    });
});

$('#close-creatArticle').click(function (e) {
    e.preventDefault();
    const modalCreatArticle = $('#modal-creatArticle');
    modalCreatArticle.css({
        'display': 'none'
    });
});




$('.btn-update-article').click(function (e) {
    e.preventDefault();
    const modalUpdatetArticle = $('#modal-updateArticle');
    modalUpdatetArticle.css({
        'display': 'flex'
    });
});

$('.close-updateArticle').click(function (e) {
    e.preventDefault();
    const modalUpdatetArticle = $('#modal-updateArticle');
    modalUpdatetArticle.css({
        'display': 'none'
    });
});

$('.btn-update-article').click(function (e) {

    let parentBtn = $(this).parent();
    let idArticle = parentBtn.attr('idArticle');


    $('#idArticle').val(idArticle)
    console.log( $('#idArticle').val());





});


