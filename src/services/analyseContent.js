import {getCorpus, saveCorpus} from './accessors';
import {predictClassification} from './model';
import l2Norm from 'compute-l2norm';

// * Options -----------------------------------------------------------------------------------------------------------

// Exported so can be set in tests
export const config = {
    vectorType: 'bagOfWords', // Options: bagOfWords, tfIdf
    wordType: 'plain', // Options: plain
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
const parseToNlpDoc = (content) => {
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
    // Return normalised values
    return nlp(content).normalize(normaliseOptions);
};

/**
 * Build Vector
 *
 * @param {object} doc
 * @return {array}
 */
const buildVector = async (doc) => {
    const words = convertToListOfWords(doc);
    switch (config.vectorType) {
        case 'tfIdf':
            return await tfIdfVector(words);
        case 'bagOfWords':
        default:
            return await bagOfWords(words);
    }
};

/**
 * Convert To List of Words
 *
 * @param {object} doc
 * @return {array}
 */
const convertToListOfWords = (doc) => {
    switch (config.wordType) {
        case 'plain':
        default:
            return doc.words().out('array').filter((v) => v !== '' && v !== null);
            // remove num? .filter((v) => isNaN(parseFloat(v)));
    }
    // const tagged = doc.out('tags'); // todo
};

/**
 * UpdateAndReturnCorpus
 *
 * @param {array} words - Array of words, can be string|array|object
 * @return {object}
 * In structure:
 * {
 *      vectorSpace: [
 *          {
 *              word: ['text', 'tag1', 'tag2'....] : Can be string|array|object
 *              f: 1, : Frequency
 *          },
 *      ],
 *      numDocs: 1,
 * }
 */
const updateAndReturnCorpus = async (words) => {
    // Get saved vector space
    let {vectorSpace, numDocs} = JSON.parse(JSON.stringify(await getCorpus()));
    // Update vector space with new words
    words.reduce((vs, word) => {
        word = typeof word !== 'object'?[word]:word;
        const lookupIndex = vectorSpaceIndexForWord(word, vs);
        if (lookupIndex >= 0) {
            // Already in vectorSpace, just increment frequency
            vs[lookupIndex].f++;
        } else {
            // New word, create new entry in vector space!
            vs.push({word: word, f: 1});
        }
        return vs;
    }, vectorSpace);
    // Increment numDocs
    numDocs++;
    // Update saved version in local storage storage (no need to wait for save to finish)
    saveCorpus({vectorSpace, numDocs});
    return {vectorSpace, numDocs};
};

/**
 * Vector Space Index For Word
 *
 * @param {*} word
 * @param {object} vectorSpace
 * @return {int}
 */
const vectorSpaceIndexForWord = (word, vectorSpace) => {
    word = typeof word !== 'object'?[word]:word;
    const lookup = vectorSpace.find((o) => JSON.stringify(o.word) === JSON.stringify(word));
    return lookup?vectorSpace.indexOf(lookup):-1;
};

/**
 * Bag of Words Vector
 *
 * @param {array} words
 * @param {object} [corpus]
 * @return {array}
 */
const bagOfWords = async (words, corpus) => {
    if (!corpus) { // Don't re-generate corpus if passed as parameter
        corpus = await updateAndReturnCorpus(words);
    }
    // Create bag of words vector based on vector space, set all values initially to 0
    const bag = corpus.vectorSpace.map(() => 0);
    words.reduce((accBag, word) => {
        accBag[vectorSpaceIndexForWord(word, corpus.vectorSpace)]++;
        return accBag;
    }, bag);
    // Return array vector
    return bag;
};

/**
 * TF-IDF Vector
 *
 * @param {array} words
 * @return {array}
 */
const tfIdfVector = async (words) => {
    // Add new words to vector space
    const corpus = await updateAndReturnCorpus(words);
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
        if (Object.keys(prediction.confidences).length < 2) {
            throw new Error();
        }
        return {
            safe: prediction.label === 'safe',
            summary: prediction.label,
            prediction: prediction,
        };
    } catch (e) {
        return {
            safe: null,
            summary: 'Cannot classify content without both safe and harmful examples.',
            prediction: null,
        };
    }
};
