document.getElementById('proxyForm').addEventListener('submit', function(e){
    e.preventDefault();
    let input = document.getElementById('urlInput').value.trim();

    if (!input.startsWith('http://') && !input.startsWith('https://')) {
        input = 'https://www.google.com/search?q=' + encodeURIComponent(input);
    }

    document.getElementById('proxyFrame').src = '/proxy?url=' + encodeURIComponent(input);
});