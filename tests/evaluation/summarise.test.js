/* eslint-disable */

import {resetStore, getFileContent, summariseTextFromFiles, listFiles} from '../utils';
import {summariseText} from '../../src/services/summarise';
const fs = require('fs');
const crypto = require('crypto');

jest.setTimeout(14400000); // 4 hours

const trainExamples = async () => {
    await summariseTextFromFiles('/tests/data/training/safe');
    await summariseTextFromFiles('/tests/data/training/harmful');
};

const saveSummary = (classification, originalFileName, summary) => {
    return new Promise((resolve) => {
        const filePath = __dirname+'/../data/summaries/'+classification+'/';
        const fileName = crypto.createHash('md5').update(originalFileName).digest('hex')+'.txt';
        // eslint-disable-next-line
        fs.writeFile(filePath + fileName, summary.join("\r\n").replace(/\\t/g, ''), () => {
            resolve();
        });
    });
};

it('Should summarise text as list using bag of words implementation', async () => {
    console.log('Begin.');
    let n = 0;

    const safeFilesDirectory = '/tests/data/validation/safe';
    const safeFiles = (await listFiles(safeFilesDirectory));
    for (const safeFile of safeFiles) {
        console.log(++n, 'safe', new Date());

        await resetStore();
        await trainExamples();
        console.log('Training complete.', new Date());

        const summary = await summariseText(await getFileContent(safeFilesDirectory, safeFile));
        await saveSummary('safe', safeFile, summary);
        console.log('Summary saved.', new Date());
    }
    console.log('SAFE FILES COMPLETE');

    const harmfulFilesDirectory = '/tests/data/validation/harmful';
    const harmfulFiles = (await listFiles(harmfulFilesDirectory));
    for (const harmfulFile of harmfulFiles) {
        console.log(++n, 'harmful', new Date());

        await resetStore();
        await trainExamples();
        console.log('Training complete.', new Date());

        const summary = await summariseText(await getFileContent(harmfulFilesDirectory, harmfulFile));
        await saveSummary('harmful', harmfulFile, summary);
        console.log('Summary saved.', new Date());
    }
    console.log('HARMFUL FILES COMPLETE');

    console.log('End.');
    expect(true).toEqual(true);
});
