//delete user



//modal update userInfo
$('.btn-update-userInfo').click(function (e) {
    e.preventDefault();
    const modalUupdate = $('#modal-update-userInfo');

    modalUupdate.css({
        'display': 'flex',
        'justify-content': 'center',
        'align-items': 'center'
    });
});
$('.close-update-userInfo').click(function (e) {
    e.preventDefault();
    const modalUupdate = $('#modal-update-userInfo');
    modalUupdate.css({
        'display': 'none'
    });
});


//modal creat new article
$('.btn-creat-article').click(function (e) {
    e.preventDefault();
    const modalCreatArticle = $('#modal-creatArticle');
    modalCreatArticle.css({
        'display': 'flex',
        'justify-content': 'center',
        'align-items': 'center'
    });
});

$('#close-creatArticle').click(function (e) {
    e.preventDefault();
    const modalCreatArticle = $('#modal-creatArticle');
    modalCreatArticle.css({
        'display': 'none'
    });
});



//update Article
$('.btn-update-article').click(function (e) {

    let idArticle = $(this).parent('#d-btn-article').attr('idArticle');
    console.log(idArticle);
    $('#idArticle').val(idArticle);
    const modalUpdatetArticle = $('#modal-updateArticle');
    modalUpdatetArticle.css({
        'display': 'flex',
        'justify-content': 'center',
        'align-items': 'center'
    });


});

$('.close-update-article').click(function (e) {
    e.preventDefault();
    const modalUpdatetArticle = $('#modal-updateArticle');
    modalUpdatetArticle.css({
        'display': 'none'
    });
});


//delete article
$('.btn-delete-articles').click(function (e) {
    let idArticle = $('#d-btn-article').attr('idArticle');

    console.log(idArticle);
    $('#article-delete').val(idArticle)



});

//seeMore Articles
$('.seeMore-articles').click(function (e) {

    let idArticle = $('#d-btn-article').attr('idArticle');
    $('#article-details').val(idArticle);

});




//change password of blogger
$('.btn-change-pass').click(function (e) {

    let idBlogger = $(this).closest('td').attr('idBlogger');
    console.log(idBlogger);
    $('#idBlogger').val(idBlogger);

});

$('.btn-close-changePassBlogger').click(function (e) {

    $('#modalChangePass').css({
        'display': 'none'
    });

});




$('.btn-delete-blogger').click(function (e) {

    let idBlogger = $(this).closest('td').attr('idBlogger');
    $(this).siblings('input').val(idBlogger);

});


//modal update article in admin page
$('.btn-update-article-admin').click(function (e) {

    let idBlogger = $(this).parent('div').attr('idArticle');
    console.log(idBlogger);
    $('#modal-updateArticleAdmin').css({
        'display': 'flex',
        'justify-content': 'center',
        'align-items': 'center'

    });
    $('#idArticle-admin').val(idBlogger);

});
$('.close-article-update-admin').click(function (e) {

    $('#modal-updateArticleAdmin').css({
        'display': 'none',
    })

});

//delete cooments 
