// select and apply animation to header at start
$('.header').addClass('animated bounceIn');

// database definition
dbStorageInit('bday');

// max users per page
const usersPerPage = 4;

// users count
let userCounts = 0;

// active page number
let activePageNumber = 0;

// users array
const persons = [];

//Funtion for error handling in promises
function errorHandler(error) {
    console.log(error);
    $('.cards').html('<div class="loader"></div>');
    $('.sub-header').html((`
            <h4 class="text-center text-danger animated bounceIn ">Error loading. Please try again later.</h4>  
        `));
}

// on load call to server
$(document).ready(function() {

        /* Get iframe src attribute value i.e. YouTube video url
    and store it in a variable */
    const url = $("#cartoonVideo").attr('src');

    /* Remove iframe src attribute on page load to
    prevent autoplay in background */
    $("#cartoonVideo").attr('src', '');
	
	/* Assign the initially stored url back to the iframe src
    attribute when modal is displayed */
    $("#myModal").on('shown.bs.modal', function(){
        $("#cartoonVideo").attr('src', url);
    });
    
    /* Assign empty url value to the iframe src attribute when
    modal hide, which stop the video playing */
    $("#myModal").on('hide.bs.modal', function(){
        $("#cartoonVideo").attr('src', '');
    });

    // get users to build HTML on load
    dbStorageGet(0,usersPerPage).then(getDataDoneFunc).catch(errorHandler);

    // count users and calculate number of pages at load
    // dbStorageCount().then(function(response){makePagination(response)});
    // faz o mesmo da de cima, mas não chama a função, passa a função
    dbStorageCount().then(makePagination).catch(errorHandler);
});

function getDataDoneFunc(data) {
    
    // loop to populate array with users
    for(key in data) {
        let obj = JSON.parse(data[key]);
        obj['id'] = key;
        persons.push(obj);
    }
    
    // clear loader spinner
    $('.cards').html('');

    // loop array to build html for each user
    persons.forEach(function(user) {
        htmlBuilder(user);
    });

    // calculate and update time every second to every user
    const intvl = setInterval(() => {
        // time calculations
        const dateCalculations = (user) => {
            const newNow = new Date();

            // distance calculation from now to birthday date
            const minute = 1000 * 60;
            const hour = minute * 60;
            const day = hour * 24;
            const distance = user.bDay - newNow.getTime();
            const days = Math.floor(distance / day);
            const hours = Math.floor((distance % day) / hour);
            const mins = Math.floor((distance % hour) / minute);
            const seconds = Math.floor((distance % minute) / 1000);

            // call to function to display time result
            htmlDisplayTime(user, days, hours, mins, seconds);

            // if it's birthday
            if (distance === 0) {
                // open modal with birthday video
                $('#myModal').modal();
                $('.modal-header h5').text('Happy Birthday ' + user.name);

                // add one year to birthday
                user.bDay + 31556952000;
            }         
        }
        persons.forEach(function(user) {
            dateCalculations(user);
        });
    }, 1000);
}

// event handler to add new user and send to htmlBuilder
$('#formSubmit').on('click', function(event) {
    event.preventDefault();

    // data from form
    let name = $('#formName').val();
    let month = $('#formMonth').val();
    const monthText = $('#formMonth option:selected').text();
    let day = $('#formDay').val();

    // form validation
    if (!name) {
        $('#formNameError').show();
        $('#formMonthError').hide();
        $('#formDayError').hide();
    } else if (!month) {
        $('#formNameError').hide();
        $('#formMonthError').show();
    } else if (!day) {
        $('#formNameError').hide();
        $('#formMonthError').hide();
        $('#formDayError').show();
    } else {
        $('#formNameError').hide();
        $('#formMonthError').hide();
        $('#formDayError').hide();

        // month and day to number after form validation
        month = Number(month);
        day = Number(day);

        // get now year and month
        const now = new Date();
        let yearNow = now.getFullYear();
        const monthNow = now.getMonth();
        const dayNow = now.getDate();

        // check if month already passed and if so, increase yearNow one year
        if (monthNow > month || (monthNow === month && day <= dayNow)) {
            yearNow++;
        }
        if (monthNow === month && day === dayNow) {
            $('#myModal').modal();
            $('.modal-header h5').text('Happy Birthday ' + name);
        }

        // user string birthday date
        const time = `${yearNow}-${monthText}-${day}`;
            
        // add user push to array and save to server
        // save to server, push to array and build HTML
        const user = {'name': name, 'date': `${monthText} ${day}`, 'bDay': new Date(time).getTime()};
            
        dbStorageSet(-1, JSON.stringify(user)).then(function(data){
            user.id = data;
            persons.push(user);

            let lastPageNumber = Number($('#pageNext').prev().text());
            let remainder = (userCounts + 1) % usersPerPage;

            let offset;

            if (remainder === 1) {
                offset = (lastPageNumber) * usersPerPage;

            } else {
                offset = (lastPageNumber - 1) * usersPerPage;
            }

            // empty HTML cards and array
            clearHTMLAndArray(true);

            dbStorageCount().then(editNewPagination).catch(errorHandler);
            dbStorageGet(offset,usersPerPage).then(getDataDoneFunc).catch(errorHandler);
            
            // form cleanup
            formClean()
            }
        ).catch(errorHandler);
        }
    });

$('.cards').on('click', '.close', function() {
    // HTML element delete
    let id = $(this).parent().attr('id');
    id = id.slice(1);
    $(this).parent().parent().remove();

    // database delete by id
    dbStorageDel(id).then(doneDelFunc).catch(errorHandler);

    function doneDelFunc() {
        const lastPageNumber = Number($('#pageNext').prev().text());
        activePageNumber = Number($('.page-numbers.active').text());
        const usersOnPage = $('.cards').children().length;
        let offset;

        // empty HTML cards and array
        clearHTMLAndArray(true);

        if (lastPageNumber === activePageNumber) {
            paginationEditMode = 'editNewPagination';
            if (usersOnPage >= 1) {
                offset = (lastPageNumber - 1) * usersPerPage;
            } else if (usersOnPage === 0) {
                offset = (lastPageNumber - 1 - 1) * usersPerPage;
            }
            dbStorageCount().then(editNewPagination).catch(errorHandler);
            dbStorageGet(offset,usersPerPage).then(getDataDoneFunc).catch(errorHandler);

        } else if(lastPageNumber > activePageNumber && activePageNumber === 1) {
            offset = 0;
            dbStorageCount().then(makePagination).catch(errorHandler);
            dbStorageGet(offset,usersPerPage).then(getDataDoneFunc).catch(errorHandler);

        } else if (lastPageNumber > activePageNumber && activePageNumber !== 1) {
            offset = (activePageNumber - 1) * usersPerPage;
            dbStorageCount().then(editDelPagination).catch(errorHandler);
            dbStorageGet(offset,usersPerPage).then(getDataDoneFunc).catch(errorHandler);
        }

    }    
});

// empty HTML cards and array
function clearHTMLAndArray(clearPagination) {
    $('.cards').html('');
    persons.length = 0;
    if (clearPagination) {
        $('.pagination').html('');
    }
};