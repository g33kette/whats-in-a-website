import {
    getClassifier as getClassifierFromStore,
    getClassifierData as getClassifierDataFromStore,
    saveClassifier as saveClassifierToStore,
} from './accessors';
import * as tf from '@tensorflow/tfjs';
import * as knnClassifier from '@tensorflow-models/knn-classifier';

// * Options -----------------------------------------------------------------------------------------------------------

// Exported so can be set in tests
export const config = {
    fixedLength: 10000,
    k: 3,
};

// * Classifier Methods  -----------------------------------------------------------------------------------------------

const getClassifier = async () => {
    let classifier = await getClassifierFromStore();
    if (!classifier) {
        classifier = knnClassifier.create();
        const classifierData = await getClassifierDataFromStore();
        if (classifierData) {
            classifier.setClassifierDataset({
                safe: tf.tensor(
                    classifierData.safe,
                [classifierData.safe.length / config.fixedLength, config.fixedLength]
                ),
                harmful: tf.tensor(
                    classifierData.harmful,
                [classifierData.harmful.length / config.fixedLength, config.fixedLength]
                ),
            });
        }
        await saveClassifierToStore(classifier);
    }
    return classifier;
};

/**
 * Train Model
 *
 * @param {array} textVector
 * @param {string} classification
 */
export const trainModel = async (textVector, classification) => {
    (await getClassifier()).addExample(tf.tensor(fixLength(textVector)), classification);
    await saveClassifierToStore(await getClassifier());
};

/**
 * Predict Classification
 *
 * @param {array} textVector
 * @return {Promise}
 */
export const predictClassification = async (textVector) => {
    const classifier = await getClassifier();
    return await classifier.predictClass(tf.tensor(fixLength(textVector)), config.k);
};

/**
 * Fix Length
 *
 * @param {array} vector
 * @return {array}
 */
function fixLength(vector) {
    if (vector.length > config.fixedLength) {
        return vector.slice(0, config.fixedLength);
    } else {
        const expanded = [];
        expanded.push(...vector);
        expanded.push(...(new Array(config.fixedLength-vector.length)).fill(0));
        return expanded;
    }
}
