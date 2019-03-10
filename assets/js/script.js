const apikey = 'Hngz7Sb3gypz2t0EcdtvnUwIIPRnQZj4';
let topics = [
        'breath of the wild',
        'ocarina of time',
        'windwaker',
        "majora's mask",
        'twilight princess'
    ],
    query = undefined,
    keyword = undefined,
    offset = 0;

const renderButtons = () => {
    $('#buttons-area').empty();

    topics.forEach(function(x) {
        $('#buttons-area').append(
            `<button class="btn btn-lg bg-warning m-1 topic">${x}</button>`
        );
    });
};

const printImages = x => {
    $('.area').empty();
    keyword = x.target.innerHTML;
    query = `http://api.giphy.com/v1/gifs/search?q=${keyword}&api_key=${apikey}&limit=10`;
    console.log(query);
    $.ajax({ url: query, method: 'GET' }).then(function(res) {
        appendImages(res);
        if (res.data.length === 10) {
            $('.area').append(
                `<button class="btn btn-lg bg-danger m-1 text-white gimme">Gimme 10 More!</button>`
            );
        } else {
            $('.area')
                .append(`<p class="strong text-center alert alert-warning">
                You've returned all of the gifs!
            </p>`);
        }
    });
};

const gimmeMore = () => {
    offset += 10;
    $.ajax({ url: `${query}&offset=${offset}`, method: 'GET' }).then(function(
        res
    ) {
        appendImages(res);
        $('.area').append(
            `<button class="btn btn-lg bg-danger m-1 text-white gimme">Gimme 10 More!</button>`
        );
    });
};

const appendImages = x => {
    $.each(x.data, function(_i, val) {
        let still = val.images.original_still.url;
        let gif = val.images.original.url;
        $('.area').append(
            `<img src="${still}" class="img-container static" data-gif="${gif}" data-still="${still}">
                <p><strong>Rating: ${val.rating.toUpperCase()} <a href="${gif}" target="_blank"><i class="ml-5 fas fa-download"></i></a></strong></p>`
        );
    });
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

$(document).on('click', '.img-container', function() {
    let still = $(this).attr('data-still');
    let gif = $(this).attr('data-gif');
    if ($(this).hasClass('static')) {
        $(this)
            .removeClass('static')
            .attr('src', gif);
    } else {
        $(this)
            .attr('src', still)
            .addClass('static');
    }
});

$(document).on('click', '.gimme', function() {
    gimmeMore();
    $(this).remove();
});

$(function() {
    renderButtons();
});
