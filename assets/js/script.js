const apikey = 'Hngz7Sb3gypz2t0EcdtvnUwIIPRnQZj4',
    base = `https://media2.giphy.com/media`,
    still = `giphy_s.gif`,
    gif = `giphy.gif`;

let topics = [
        'breath of the wild',
        'ocarina of time',
        'wind waker',
        "majora's mask",
        'twilight princess'
    ],
    query = undefined,
    keyword = undefined,
    offset = 0,
    msg1 = $('#message1').html(),
    msg2 = $('#message2').html(),
    faves = JSON.parse(localStorage.getItem('favegifs'));

// check if faves array exists in local storage
if (!Array.isArray(faves)) {
    faves = [];
}

const renderButtons = () => {
    $('#buttons-area').empty();
    topics.forEach(function(x) {
        let btn = $('<button>')
            .addClass('btn btn-lg bg-warning m1 topic')
            .text(x);
        $('#buttons-area').append(btn);
    });
};

const printImages = x => {
    $('.area').empty();
    keyword = x.target.innerHTML;
    query = `https://api.giphy.com/v1/gifs/search?q=${keyword}&api_key=${apikey}&limit=10`;
    $.ajax({ url: query, method: 'GET' }).then(function(res) {
        printMessage();
        appendImages(res);
        appendButtons(res);
    });
};

const printMessage = () => {
    $('.alert-success').remove();
    $('.area')
        .append(msg1)
        .find('.alert-success')
        .slideDown()
        .delay(2000)
        .slideUp();
};

const appendImages = x => {
    $.each(x.data, function(_i, val) {
        let id = val.id;
        let imgContainer = $('<figure>')
            .addClass('img-container')
            .attr('data-fave', id);
        let img = $('<img>')
            .addClass('static')
            .attr({
                src: `${base}/${id}/${still}`,
                'data-id': id
            });
        imgContainer.append(img);
        appendMeta(imgContainer, `${base}/${id}/${gif}`);
        $('.area').append(imgContainer);
    });
};

const appendMeta = (container, url) => {
    let dl = $('<a>')
        .attr({ target: '_blank', href: url })
        .addClass('btn btn-block bg-success')
        .html(`<i class="fas fa-download"></i>`);
    dl = dl
        .wrapAll('<div>')
        .parent()
        .html();
    let fave = $('<button>')
        .addClass('btn btn-block bg-danger faveBtn')
        .html(`<i class="fas fa-heart" />`);
    fave = fave
        .wrapAll('<div>')
        .parent()
        .html();
    let meta = $('<p>').html(`${dl} ${fave}`);
    container.append(meta);
};

const appendButtons = x => {
    if (x.data.length === 10) {
        let btn = $('<button>')
            .addClass('btn btn-lg bg-danger m-1 text-white gimme')
            .text('Gimme 10 more!');
        $('.area').append(btn);
    } else {
        let alert = $('<p>')
            .addClass('strong text-center alert alert-warning')
            .text("You've returned all the gifs!");
        $('.area').append(alert);
    }
};

const gimmeMore = () => {
    offset += 10;
    $.ajax({ url: `${query}&offset=${offset}`, method: 'GET' }).then(function(
        res
    ) {
        appendImages(res);
        appendButtons(res);
    });
};

const renderFaves = () => {
    // empty out faves area
    $('.faves').empty();
    $('.area').empty();
    $('.faves').html(`<h1>Your Favorite <em>Legend of Zelda</em> GIFs</h1>`);

    // loop through array to render faves
    for (let i = 0; i < faves.length; i++) {
        // create variable that holds fave box
        let imgContainer = $('<figure>').addClass('img-container');

        // append fave into imgContainer
        imgContainer.html(faves[i]);

        // create remove button
        let removeFave = $('<button>')
            .attr('data-id', i)
            .addClass('remove-fave btn btn-block bg-danger text-white')
            .html(`<i class="fas fa-trash"></i>`);

        // add button to container
        imgContainer.append(removeFave);

        $('.area').append(imgContainer);
    }
};

$('#add-topic').on('keypress', function(event) {
    if (event.which === 13) {
        event.preventDefault();
        let topic = $(this)
            .val()
            .trim()
            .toLowerCase();
        topics.push(topic);
        $(this).val('');
        renderButtons();
    }
});
$(document).on('click', '.topic', printImages);

$(document).on('click', 'img', function() {
    $('.alert-info').remove();
    let id = $(this).attr('data-id');
    if ($(this).hasClass('static')) {
        $(this)
            .removeClass('static')
            .attr('src', `${base}/${id}/${gif}`)
            .parent()
            .prepend(ms2)
            .delay(500)
            .find('.alert-info')
            .slideDown()
            .delay(1250)
            .slideUp();
    } else {
        $(this)
            .addClass('static')
            .attr('src', `${base}/${id}/${still}`);
    }
});

$(document).on('click', '.faveBtn', function() {
    if (!$(this).hasClass('faved')) {
        let faveItem = $(this)
            .parent()
            .prev();

        // get neat html string of faveItem
        faveItem = faveItem
            .wrapAll('<div>')
            .parent()
            .html();

        // append string to array
        faves.push(faveItem);

        // save array in local storage
        localStorage.setItem('favegifs', JSON.stringify(faves));

        // disable fave button
        $(this).slideUp();
    } else {
        alert('Sweet, this GIF is already in your favorites!');
    }
});

$(document).on('click', '.gimme', function() {
    gimmeMore();
    $(this).remove();
});

$('#show-search').on('click', function() {
    $('.area').empty();
    $('.faves').fadeOut();
    $('.search')
        .delay(500)
        .fadeIn();
});

$('#show-faves').on('click', function() {
    $('.area').empty();
    $('.search').fadeOut();
    $('.faves')
        .delay(500)
        .fadeIn();
    if (!faves.length > 0) {
        $('.faves').html(
            `<h2>Looks like you haven't favorited any gifs yet!</h2>`
        );
    } else {
        setTimeout(function() {
            renderFaves(faves);
        }, 600);
    }
});

$(document).on('click', '.remove-fave', function() {
    let id = $(this).attr('data-id');

    // remove from array at index
    faves.splice(id, 1);

    // render faves again
    renderFaves(faves);

    // re-save array in local storage
    localStorage.setItem('favegifs', JSON.stringify(faves));
});

$(function() {
    renderButtons();
    $('#message1').remove();
    $('#message2').remove();
});
