function readURL(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader()

        reader.onload = function (e) {
            $('#blah')
                .attr('src', e.target.result)
        }

        reader.readAsDataURL(input.files[0])
    }
}

document.getElementById('submitImage').addEventListener('click', function() {
    window.location.href = 'pages/music_play/music_list.html';
});

