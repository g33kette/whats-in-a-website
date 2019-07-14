/**
 * https://github.com/mljs/naive-bayes
 */

import {
    getClassifierData as getClassifierDataFromStore,
    saveClassifier as saveClassifierToStore,
} from '../accessors';
import {MultinomialNB} from 'ml-naivebayes';
import {fixLength} from '../model';


// * Options -----------------------------------------------------------------------------------------------------------

// Exported so can be set in tests
export const config = {};

// * Classifier Methods  -----------------------------------------------------------------------------------------------

/**
 * Get Classifier
 *
 * @return {Promise<MultinomialNB>}
 */
const getClassifier = async () => {
    const classifierData = await getClassifierData();
    if (classifierData[0].length && classifierData[1].length) {
        const trainingData = [].concat(classifierData[0]).concat(classifierData[1]);
        const labelsData = [].concat((new Array(classifierData[0].length)).fill(0))
            .concat((new Array(classifierData[1].length)).fill(1));
        const classifier = new MultinomialNB(); // New instance of classifier
        classifier.train(trainingData, labelsData);
        return classifier;
    }
    return null;
};

/**
 * Get Classifier Data
 *
 * @return {Promise<[]>}
 */
const getClassifierData = async () => {
    const classifierData = await getClassifierDataFromStore();
    return classifierData&&Object.keys(classifierData).length?classifierData:[[], []];
};


/**
 * Train Model
 *
 * For this implementation, all we do is update data array.
 *
 * @param {array} textVector
 * @param {string} classification
 */
export const trainModel = async (textVector, classification) => {
    let classifierData = await getClassifierData();
    classifierData[classification==='safe'?1:0].push(fixLength(textVector));
    await saveClassifierToStore(null, classifierData);
    return true;
};

/**
 * Predict Classification
 *
 * @param {array} textVector
 * @return {Promise}
 */
export const predictClassification = async (textVector) => {
    const classifier = await getClassifier();
    const output = classifier.predict([fixLength(textVector)])[0];
    return {label: output?'safe':'harmful', value: output, confidences: [0, 1]};
};
