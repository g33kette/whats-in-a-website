import {prepareText, config as analyseContentConfig} from '../src/services/analyseContent';
import store from '../src/store/store';
import {reset} from './../src/store/actions';

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
