import {bagOfWords, tfIdfVector, parseToNlpDoc, updateAndReturnCorpusObject} from './analyseContent';
import {getPhraseCorpus, savePhraseCorpus} from './accessors';

// * Options -----------------------------------------------------------------------------------------------------------

// Exported so can be set in tests
export const config = {
    vectorType: 'bagOfWords', // Options: bagOfWords, tfIdf
    nPhrases: 20,
};

/**
 * Summarise Text
 *
 * @param {string} rawText
 */
export const summariseText = async (rawText) => {
    const parsed = parseToNlpDoc(rawText);
    // Initial match pattern... const nounPhrases = parsed.match('#Noun #Verb').out('array');
    const nounPhrases = parsed.match('#Adjective? #Noun #Verb #Adjective? #Noun?').out('array');
    const vector = await buildVector(nounPhrases);
    // Get the indexes of the top weighted phrases
    const topPhraseIndexes = vector.map((v, k) => [k, v])
        .sort((a, b) => (a[1] > b[1])?-1:1)
        .slice(0, config.nPhrases)
        .map((a) => a[0]);
    const summaryPhrases = nounPhrases.filter((v, k) => topPhraseIndexes.indexOf(k) >= 0);
    return summaryPhrases;
};

/**
 * Build Vector
 *
 * @param {array} nounPhrases
 * @return {array}
 */
const buildVector = async (nounPhrases) => {
    const corpus = await updateAndReturnPhraseCorpus(nounPhrases);
    switch (config.vectorType) {
        case 'tfIdf':
            return await tfIdfVector(nounPhrases, corpus);
        case 'bagOfWords':
        default:
            return await bagOfWords(nounPhrases, corpus);
    }
};

/**
 * Update And Return Phrase Corpus
 *
 * @param {array} phrases - Array of phrases
 * @return {object}
 */
const updateAndReturnPhraseCorpus = async (phrases) => {
    const updatedCorpus = updateAndReturnCorpusObject(phrases, await getPhraseCorpus());
    // Update saved version in local storage storage (no need to wait for save to finish)
    savePhraseCorpus(updatedCorpus);
    return updatedCorpus;
};
