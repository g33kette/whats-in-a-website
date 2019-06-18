/* eslint-disable no-undef */

import {prepareText, config as analyseContentConfig} from '../src/services/analyseContent';
import store from '../src/store/store';
import {reset} from './../src/store/actions';
import {trainModel} from '../src/services/model';
import fs from 'fs';

/**
 * Reset Store
 *
 * @return {Promise<void>}
 */
export async function resetStore() {
    await store.dispatch(reset());
}

/**
 * Prepare Vector
 *
 * @param {string} text
 * @param {string} vectorType
 * @param {string} wordType
 * @return {Promise<Number[]>}
 */
export async function prepareVector(text, vectorType, wordType) {
    return (await prepareVectors([text], vectorType, wordType))[0];
}

/**
 * Prepare Vectors
 *
 * @param {string[]} texts
 * @param {string} vectorType
 * @param {string} wordType
 * @return {Promise<Array[]>}
 */
export async function prepareVectors(texts, vectorType, wordType) {
    analyseContentConfig.vectorType = vectorType;
    analyseContentConfig.wordType = wordType;
    const results = [];
    for (const text of texts) {
        results.push(await prepareText(text));
    }
    return results;
}

/**
 * Train
 *
 * @param {array} safeTexts
 * @param {array} harmfulTexts
 * @param {string} vectorType
 * @param {string} wordType
 * @return {Promise<void>}
 */
export async function train(safeTexts, harmfulTexts, vectorType, wordType) {
    const safe = await prepareVectors(safeTexts, vectorType, wordType);
    for (const vector of safe) {
        await trainModel(vector, 'safe');
    }
    const harmful = await prepareVectors(harmfulTexts, vectorType, wordType);
    for (const vector of harmful) {
        await trainModel(vector, 'harmful');
    }
}

/**
 * Sleep
 * @param {int} s
 * @return {Promise<any>}
 */
export function sleep(s) {
    return new Promise((resolve) => {
       setTimeout(() => resolve('slept.'), s*1000);
    });
}

/**
 * Train From Files
 *
 * @param {string} safeFilesDirectory
 * @param {string} harmfulFilesDirectory
 * @param {string} vectorType
 * @param {string} wordType
 * @param {int} limit
 * @return {Promise<void>}
 */
export async function trainFromFiles(safeFilesDirectory, harmfulFilesDirectory, vectorType, wordType, limit) {
    await trainCategorisationFiles('safe', safeFilesDirectory, vectorType, wordType, limit);
    await trainCategorisationFiles('harmful', harmfulFilesDirectory, vectorType, wordType, limit);
}


// Private Methods -----------------------------------------------------------------------------------------------------

const listFiles = (dir) => {
    return new Promise((resolve, reject) => {
        fs.readdir(__dirname+'/..'+dir, function(err, files) {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        });
    });
};

const getFileContent = (dir, file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(__dirname+'/..'+dir+'/'+file, 'utf8', function(error, contents) {
            if (error) {
                reject(error);
            } else {
                resolve(contents);
            }
        });
    });
};

const trainCategorisationFiles = async (category, filesDirectory, vectorType, wordType, limit) => {
    const files = await listFiles(filesDirectory);
    limit = limit?limit:files.length;
    for (const file of files) {
        await trainCategorisationFromFile(category, filesDirectory, file, vectorType, wordType);
        if (!--limit) {
            break;
        }
    }
};

const trainCategorisationFromFile = async (category, filesDirectory, file, vectorType, wordType) => {
    const fileContent = await getFileContent(filesDirectory, file);
    const vector = await prepareVector(fileContent, vectorType, wordType);
    await trainModel(vector, category);
    // console.log('. ['+category+']');
};
