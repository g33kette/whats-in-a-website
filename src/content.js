import {parseContent} from './scripts/contentProtect';
import {updateLoadingMessage} from './scripts/contentInterface';
import $ from 'jquery';

let finit = (content) => {
    setTimeout(() => { // Fakin' it.
        updateLoadingMessage('Done.');
        $('#bp .loading')
                .append($('<textarea style="position: relative; width: 80%; height: 30vh; margin-top: 25%;" />')
                .text(content));
        console.log('Contented.');
    }, 2000);
};

parseContent().then(finit);
