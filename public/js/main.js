


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



//update,delete,seeDetailsArticle
$('.btn-update-article').click(function (e) {

    let idArticle = $('#d-btn-article').attr('idArticle');

    $('#article-update').val(idArticle)


});

$('.btn-delete-articles').click(function (e) {
    let idArticle = $('#d-btn-article').attr('idArticle');

    console.log(idArticle);
    $('#article-delete').val(idArticle)



});

$('.btn-details-articles').click(function (e) {

    let idArticle = $('#d-btn-article').attr('idArticle');
    console.log(idArticle);

    $('#article-details').val(idArticle);
    console.log($('#article-details').val());


});





$('.btn-changePassBlogger').click(function (e) {



    let idBlogger = $(this).parent('td').attr('idBlogger')
    $('#idBlogger').val(idBlogger);
    $('#modalChangePass').css({
        'display': 'flex'
    })

});

$('.btn-close-changePassBlogger').click(function (e) {

    $('#modalChangePass').css({
        'display': 'none'
    });

});




$('.btn-delete-blogger').click(function (e) {

    let idBlogger = $(this).closest('td').attr('idBlogger');
    console.log(idBlogger);
    $(this).siblings('input').val(idBlogger)

});


$('.btn-update-article-admin').click(function (e) {

    let idBlogger = $(this).parent('div').attr('idArticle');
    console.log(idBlogger);
    $('#modal-updateArticle-admin').css({
        'display': 'flex'
    })
    $('#idArticle-admin').val(idBlogger);

});
