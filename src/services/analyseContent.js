import {getCorpus, saveCorpus} from './accessors';
import {predictClassification} from './model';
import l2Norm from 'compute-l2norm';
const nlp = require('compromise');

// * Options -----------------------------------------------------------------------------------------------------------

// Exported so can be set in tests
export const config = {
    vectorType: 'bagOfWords', // Options: bagOfWords, tfIdf
    wordType: 'plain', // Options: plain, tagged
};

// * Prepare Text ------------------------------------------------------------------------------------------------------

/**
 * Prepare Text
 *
 * @param {string} content
 * @return {Promise}
 */
export const prepareText = async (content) => {
    return await buildVector(parseToNlpDoc(content));
};

/**
 * Parse to NLP Doc
 *
 * @param {string} content
 * @return {object}
 */
export const parseToNlpDoc = (content) => {
    return nlp(content).normalize();
};

/**
 * Build Vector
 *
 * @param {object} doc
 * @return {array}
 */
const buildVector = async (doc) => {
    const words = convertToListOfWords(doc);
    const corpus = await updateAndReturnWordCorpus(words);
    switch (config.vectorType) {
        case 'tfIdf':
            return await tfIdfVector(words, corpus);
        case 'bagOfWords':
        default:
            return await bagOfWords(words, corpus);
    }
};

/**
 * Convert To List of Words
 *
 * @param {object} doc
 * @return {array}
 */
const convertToListOfWords = (doc) => {
    const normalized = doc.words().normalize({
        possessives: true,
        plurals: true,
        verbs: true,
    });
    switch (config.wordType) {
        case 'tagged':
            return normalized.out('tags');
        case 'plain':
        default:
            return normalized.out('array');
    }
};

// * Prepare Vector ----------------------------------------------------------------------------------------------------

/**
 * Update And Return Corpus Object
 *
 * @param {array} items - Array of words, can be string|array|object
 * @param {object} corpus to update (from store)
 * @return {object}
 * In structure:
 * {
 *      vectorSpace: [
 *          {
 *              item: ['text', 'tag1', 'tag2'....] : Can be string|array|object
 *              f: 1, : Frequency
 *          },
 *      ],
 *      numDocs: 1,
 * }
 */
export const updateAndReturnCorpusObject = async (items, corpus) => {
    // Get saved vector space
    let {vectorSpace, numDocs} = JSON.parse(JSON.stringify(corpus));
    // Update vector space with new words
    items.reduce((vs, item) => {
        item = typeof item !== 'object'?[item]:item;
        const lookupIndex = vectorSpaceIndexForItem(item, vs);
        if (lookupIndex >= 0) {
            // Already in vectorSpace, just increment frequency
            vs[lookupIndex].f++;
        } else {
            // New item, create new entry in vector space!
            vs.push({item: item, f: 1});
        }
        return vs;
    }, vectorSpace);
    // Increment numDocs
    numDocs++;
    return {vectorSpace, numDocs};
};

/**
 * Update And Return Word Corpus
 *
 * @param {array} words - Array of words, can be string|array|object
 * @return {object}
 */
const updateAndReturnWordCorpus = async (words) => {
    const updatedCorpus = await updateAndReturnCorpusObject(words, await getCorpus());
    // Update saved version in local storage storage (no need to wait for save to finish)
    saveCorpus(updatedCorpus);
    return updatedCorpus;
};

/**
 * Vector Space Index For Item
 *
 * @param {*} item
 * @param {object} vectorSpace
 * @return {int}
 */
const vectorSpaceIndexForItem = (item, vectorSpace) => {
    item = typeof item !== 'object'?[item]:item;
    const lookup = vectorSpace.find((o) => JSON.stringify(o.item) === JSON.stringify(item));
    return lookup?vectorSpace.indexOf(lookup):-1;
};

/**
 * Bag of Words Vector
 *
 * @param {array} words
 * @param {object} [corpus]
 * @return {array}
 */
export const bagOfWords = async (words, corpus) => {
    // Create bag of words vector based on vector space, set all values initially to 0
    const bag = corpus.vectorSpace.map(() => 0);
    words.reduce((accBag, word) => {
        accBag[vectorSpaceIndexForItem(word, corpus.vectorSpace)]++;
        return accBag;
    }, bag);
    // Return array vector
    return bag;
};

/**
 * TF-IDF Vector
 *
 * @param {array} words
 * @param {object} corpus
 * @return {array}
 */
export const tfIdfVector = async (words, corpus) => {
    // Create bag of words vector based on vector space
    let tfIdfVector = await bagOfWords(words, corpus);
    // Re-assign weight based on td-idf calculation
    tfIdfVector.forEach(function(tf, i) {
        if (tf === 0) return; // Continue if frequency is 0
        const vectorSpaceTerm = corpus.vectorSpace[i];
        const idf = 1 + (Math.log(corpus.numDocs / (1 + vectorSpaceTerm.f)));
        this[i] = tf * idf;
    }, tfIdfVector); // use arr as this
    const tfIdfL2Norm = l2Norm(tfIdfVector);
    tfIdfVector = tfIdfVector.map((v) => v/tfIdfL2Norm);
    return tfIdfVector;
};

// * Analyse Content ---------------------------------------------------------------------------------------------------

/**
 * Analyse Content
 *
 * @param {array} textVector
 * @return {Promise}
 */
export const analyseContent = async (textVector) => {
    try {
        const prediction = await predictClassification(textVector);
        if (!prediction || Object.keys(prediction.confidences).length < 2) {
            throw new Error('Prediction is empty or more than one category has not been trained.');
        }
        return {
            safe: prediction.label === 'safe',
            classification: prediction.label,
            message: null,
            prediction: prediction,
        };
    } catch (e) {
        return {
            safe: null,
            classification: 'unknown',
            message: null,
            prediction: null,
        };
    }
};
