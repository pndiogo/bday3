// function to build Bootstrap col with user data
const htmlBuilder = function(user) {
    const html = `
        <div class="col-lg-3 col-md-6 col-sm-12 mt-3">
            <div class="card border-light" id="u${user.id}">
            <button type="button" class="close text-right mt-2 mr-2" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
                <div class="card-body text-center">
                    <h3 class="card-title">${user.name}</h3>
                    <h5 class="card-subTitle">${user.date}</h5>
                    <hr class="cardLine">
                    <p class="card-info text-muted">You'll celebrate your next birthday in:</p>
                    <p class="card-text"></p>
                </div>
            </div>
        </div>`;
    $('.cards').append(html);
};


// display time result
const htmlDisplayTime = function(user, days, hours, mins, seconds) {
    $('#u' + user.id).find('.card-text').html(`
    <div>${days}<span> Days</span></div>
    <div>${hours}<span> Hours</span></div>
    <div>${mins}<span> Minutes</span></div>
    <div>${seconds}<span> Seconds</span></div>
    `);
};

// form cleanup
const formClean = function() {
    $('#formName').val('');
    $('#formMonth').val('');
    $('#formDay').val('');
};

// pagination build on load
const htmlPgOnLoad = function() {
    $('#pagination-row').html(`
        <nav aria-label="Page navigation">
            <ul class="pagination pagination-lg">
                <li class="page-item disabled" id="page-prev">
                    <a class="page-link" href="#" tabindex="-1">Previous</a>
                </li>
                <li class="page-item disabled">
                    <a class="page-link active" href="#" tabindex="-1">1</a>
                </li>
                <li class="page-item disabled" id="page-next">
                    <a class="page-link" href="#" tabindex="-1">Next</a>
                </li>
            </ul>
        </nav>
    `)
};