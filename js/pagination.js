// event listener to navigate through pages
$('.pagination').on('click', '.page-numbers', function(event){
    event.preventDefault();
    let pageNumber = parseInt(this.innerText);
    let firstPageText = parseInt($('#pagePrevious').next().text());
    let lastPageText = parseInt($('#pageNext').prev().text());

    if (pageNumber === firstPageText) {
        $('#pagePrevious').attr('tabindex','-1').addClass('disabled');
    } else {
        $('#pagePrevious').attr('tabindex','').removeClass('disabled');
    }

    if (pageNumber === lastPageText) {
        $('#pageNext').attr('tabindex','-1').addClass('disabled');
    } else {
        $('#pageNext').attr('tabindex','').removeClass('disabled');
    }

    $('.page-numbers').removeClass('active');
    $(this).addClass('active');
    
    clearHTMLAndArray(false);

    let offset = (pageNumber - 1) * usersPerPage;

    dbStorageGet(offset,usersPerPage).then(getDataDoneFunc).catch(errorHandler);
})

// click event on next
$('.pagination').on('click', '#pageNext', function(event){
    if(!$(this).hasClass('disabled')) {
        event.preventDefault();
        let activePage = $('.page-numbers.active')
        let pageNumber = parseInt(activePage.text());
        let offset = (pageNumber - 1 + 1) * usersPerPage;
        clearHTMLAndArray()
        dbStorageGet(offset,usersPerPage).then(getDataDoneFunc).catch(errorHandler);

        $('#pagePrevious').attr('tabindex','').removeClass('disabled');

        activePage.removeClass('active');
        activePage.next().addClass('active');

        activePage = $('.page-numbers.active')

        let indexLastPage = activePage.index();
        let indexNext = $('#pageNext').index();


        if (((indexNext - 1) === indexLastPage)) {
            $('#pageNext').addClass('disabled');
        }
    }
})

// click event on previous
$('.pagination').on('click', '#pagePrevious', function(event){
    if(!$(this).hasClass('disabled')) {
        event.preventDefault();
        let activePage = $('.page-numbers.active')
        let pageNumber = parseInt(activePage.text());
        let offset = (pageNumber - 1 - 1) * usersPerPage;
        clearHTMLAndArray()
        dbStorageGet(offset,usersPerPage).then(getDataDoneFunc).catch(errorHandler);

        $('#pageNext').attr('tabindex','').removeClass('disabled');

        activePage.removeClass('active');
        activePage.prev().addClass('active');

        activePage = $('.page-numbers.active')

        let indexFirstPage = activePage.index();

        if ((indexFirstPage === 1)) {
            $('#pagePrevious').attr('tabindex','-1').addClass('disabled');
        }
    }
})

// pagination build
function pagination(data, source) {
    // calculate numbers of pages at start, variables from main.js
    userCounts = Number(data);
    let totalPages = Math.ceil(userCounts/usersPerPage);
    // build pagination HTML
    $('#pages').append(`
    <li class="page-item disabled" id="pagePrevious" tabindex="-1"><a class="page-link" href="#">Previous</a></li>
    `)
    for (let i = 1; i <= totalPages; i++) {
        $('#pages').append(`
        <li class="page-item page-numbers"><a class="page-link" href="#">${i}</a></li>
        `)
    }
    $('#pages').append(`
    <li class="page-item" id="pageNext" tabindex=""><a class="page-link" href="#">Next</a></li>
    `)
    // page, previous and next state depending on source
    if (totalPages === 0) {
        $('.sub-header').html((`
            <h4 class="text-center animated bounceIn">Please enter a new birthday person</h4>  
        `));
        $('.pagination').html('');
    } else if (totalPages === 1) {
        $('#pageNext').attr('tabindex','-1').addClass('disabled');
        $('#pagePrevious').next().addClass('active');
    } else if (totalPages > 1) {
        if (source === 'load') {
            $('#pagePrevious').next().addClass('active');
        } else if (source === 'new') {
            $('#pagePrevious').attr('tabindex','').removeClass('disabled');
            $('#pagePrevious').next().removeClass('active');
            $('#pageNext').attr('tabindex','-1').addClass('disabled');
            $('#pageNext').prev().addClass('active');    
        } else if (source === 'del') {
            $('#pagePrevious').attr('tabindex','').removeClass('disabled');
            $('#pagePrevious').next().removeClass('active');
            $('#pageNext').attr('tabindex','').removeClass('disabled');
            $('.page-numbers').eq(activePageNumber - 1).addClass('active')
        }
    }
}

// edit pagination when new user is added
function editNewPagination(data) {
    pagination(data,'new');
}

// edit pagination when an user is deleted
function editDelPagination(data) {
    pagination(data,'del');
}

// make pagination at load
function makePagination(data) {
    pagination(data,'load');
}