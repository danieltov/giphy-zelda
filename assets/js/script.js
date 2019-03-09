const apikey = 'Hngz7Sb3gypz2t0EcdtvnUwIIPRnQZj4';
let topics = [
        'breath of the wild',
        'ocarina of time',
        'windwaker',
        "majora's mask",
        'twilight princess'
    ],
    query = undefined,
    keyword = undefined;

const renderButtons = () => {
    topics.forEach(function(x) {
        $('#buttons-area').append(
            `<button class="btn btn-lg bg-warning topic">${x}</button>`
        );
    });
};

const printImages = x => {
    keyword = x.target.innerHTML;
    query = `http://api.giphy.com/v1/gifs/search?q=${keyword}&api_key=${apikey}&limit=10`;
    $.ajax({ url: query, method: 'GET' }).then(function(res) {
        $.each(res.data, function(_i, val) {
            let still = val.images.original_still.url;
            let gif = val.images.original.url;
            $('.area').append(
                `<img src="${still}" class="img-container static" data-gif="${gif}" data-still="${still}">`
            );
        });
    });
};

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

$(function() {
    renderButtons();
});
