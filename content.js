console.log("Hello from your Chrome extension!");
$(document).ready(function() {
    let style = [
        'width: 100%;',
        'height: 100%;',
        'z-index:1000;',
        'background-color: rgba(0, 255, 0, 0.6);',
        'position: absolute;',
    ];
    let cover = $('<div style="'+style.join(' ')+'"><h1 style="text-align: center">WARNING</h1></div>');
    console.log('cover', cover);
    let content = $('<pre style="width: 80%; height: 60vh; overflow: auto; margin: auto; background-color: rgba(255, 255, 0, 0.6);" />');
    content.text($('body').text());
    cover.append(content);
    console.log('content', content);
    $('html').prepend(cover);//.css('height', '100%');
    $('body').hide();
    
});