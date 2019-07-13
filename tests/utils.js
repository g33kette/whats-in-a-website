/* eslint-disable no-undef */

import {prepareText, config as analyseContentConfig} from '../src/services/analyseContent';
import store from '../src/store/store';
import {reset, setUsername} from './../src/store/actions';
import {predictClassification, trainModel} from '../src/services/model';
import fs from 'fs';

/**
 * Reset Store
 *
 * @return {Promise<void>}
 */
export async function resetStore() {
    await store.dispatch(reset());
    await store.dispatch(setUsername('test'));
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
    console.log('Training complete.', (new Date()).toISOString());
}

/**
 * Prepare Vectors From Files
 *
 * @param {string} filesDirectory
 * @param {string} vectorType
 * @param {string} wordType
 * @param {int} limit
 * @return {Promise<Array[]>}
 */
export async function prepareVectorsFromFiles(filesDirectory, vectorType, wordType, limit) {
    const files = await listFiles(filesDirectory);
    const vectors = [];
    limit = limit?limit:files.length;
    for (const file of files) {
        // console.log(file);
        vectors.push(await prepareVectorFromFile(filesDirectory, file, vectorType, wordType));
        if (!--limit) {
            break;
        }
    }
    return vectors;
}

/**
 * Run Evaluation
 *
 * @param {string} dataDir
 * @param {string} vectorType
 * @param {string} wordType
 * @return {Promise<void>}
 */
export async function runClassificationEvaluation(dataDir, vectorType, wordType) {
    let classification;
    let vector;
    const results = {tp: 0, tn: 0, fp: 0, fn: 0};
    const evaluateSafeFiles = await listFiles(dataDir + '/safe');
    for (const safeFile of evaluateSafeFiles) {
        vector = await prepareVectorFromFile(dataDir + '/safe', safeFile, vectorType, wordType);
        classification = await predictClassification(vector);
        if (classification.label === 'safe') {
            results.tp++;
            console.log('. ✓', classification.label, (new Date()).toISOString());
        } else {
            results.fn++;
            console.log('. X', classification.label, (new Date()).toISOString());
        }
    }
    const evaluateHarmfulFiles = await listFiles(dataDir + '/harmful');
    for (const harmfulFile of evaluateHarmfulFiles) {
        vector = await prepareVectorFromFile(dataDir + '/harmful', harmfulFile, vectorType, wordType);
        classification = await predictClassification(vector);
        if (classification.label === 'harmful') {
            results.tn++;
            console.log('. ✓', classification.label, (new Date()).toISOString());
        } else {
            results.fp++;
            console.log('. X', classification.label, (new Date()).toISOString());
        }
    }
    outputModelEvaluationResults(results);
}

// Private Methods -----------------------------------------------------------------------------------------------------

const listFiles = (dir) => {
    return new Promise((resolve, reject) => {
        fs.readdir(__dirname+'/..'+dir, function(err, files) {
            if (err) {
                reject(err);
            } else {
                resolve(files.filter((fn) => fn !== '.gitkeep'));
            }
        });
    });
};

export const getFileContent = (dir, file) => {
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
        // console.log(category, file);
        await trainCategorisationFromFile(category, filesDirectory, file, vectorType, wordType);
        if (!--limit) {
            break;
        }
    }
};

const trainCategorisationFromFile = async (category, filesDirectory, file, vectorType, wordType) => {
    const vector = await prepareVectorFromFile(filesDirectory, file, vectorType, wordType);
    await trainModel(vector, category);
};

const prepareVectorFromFile = async (filesDirectory, file, vectorType, wordType) => {
    const fileContent = await getFileContent(filesDirectory, file);
    return await prepareVector(fileContent, vectorType, wordType);
};

/**
 * Output Model Evaluation Results
 * @param {*} results
 */
const outputModelEvaluationResults = (results) => {
    // Sensitivity = TP / TP + FN
    // Specificity = TN / TN + FP
    // Precision = TP / TP + FP
    // True-Positive Rate = TP / TP + FN
    // False-Positive Rate = FP / FP + TN
    // True-Negative Rate = TN / TN + FP
    // False-Negative Rate = FN / FN + TP
    const accuracy = (results.tp + results.tn) === 0 ? 0
        : (((results.tp + results.tn)/(results.tp + results.tn + results.fp + results.fn))*100);
    const sensitivity = (results.tp + results.fn) === 0 ? 0
        : (results.tp/(results.tp + results.fn));
    const specificity = (results.tn + results.fp) === 0 ? 0
        : (results.tn/(results.tn + results.fp));
    const precision = (results.tp + results.fp) === 0 ? 0
        : (results.tp/(results.tp + results.fp));
    const totalResults = (results.tp + results.tn + results.fn + results.fp);
    console.log('Final correct score: '+(results.tp + results.tn)+'/'+totalResults);
    console.log('Final accuracy score: '+accuracy+'%');
    console.log('Final sensitivity score: '+sensitivity);
    console.log('Final specificity score: '+specificity);
    console.log('Final precision score: '+precision);
};
