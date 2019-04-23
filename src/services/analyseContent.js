import {getCorpus, saveCorpus} from '../background';

// * Prepare Text ------------------------------------------------------------------------------------------------------

/**
 * Prepare Text
 *
 * @param {string} content
 * @return {Promise}
 */
export const prepareText = (content) => {
    return new Promise((resolve) => {
        const nlp = require('compromise');
        const normaliseOptions = {
            whitespace: true,
            case: true,
            numbers: true,
            punctuation: true,
            unicode: true,
            contractions: true,
            acronyms: true,
            // Enable non-defaults:
            possessives: true,
            plurals: true,
            verbs: true,
        };
        // // Normalise and remove numeric values
        // const doc = nlp(content).normalize(normaliseOptions).filter((v) => isNaN(parseFloat(v)));
        const doc = nlp(content).normalize(normaliseOptions);
        const words = doc.words();
        // const tagged = doc.out('tags');
        const vector = buildVector(words.out('array'));
        resolve(vector);
    });
};

const buildVector = (words) => {
    return bagOfWords(words);
};

const bagOfWords = (words) => {
    const corpus = buildCorpus(words);
    const bag = {};
    corpus.reduce((v, k) => Object.assign(bag, {[k]: 0}));
    for (const word of words) {
        if (typeof bag[word] === 'undefined') {
            continue; // Shouldn't happen...
        }
        bag[word]++;
    }
    return Object.values(bag);
};

const buildCorpus = (words) => {
    // Get saved corpus
    let corpus = JSON.parse(JSON.stringify(getCorpus()));
    // Add new words to corpus
    corpus.push(...words);
    // Filter to only include unique words
    corpus = corpus.filter((v, i, a) => a.indexOf(v) === i);
    // If corpus has expanded then save to storage
    if (corpus.length > getCorpus().length) {
        saveCorpus(corpus);
    }
    return corpus;
};

// * Analyse Content ---------------------------------------------------------------------------------------------------

/**
 * Analyse Content
 *
 * @param {object} textData
 * @return {Promise}
 */
export const analyseContent = (textData) => {
    return new Promise((resolve) => {
        let result = {safe: false, summary: JSON.stringify(textData)};
        setTimeout(() => { // TODO Pretending...
            resolve(result);
        }, 500);
    });
};
