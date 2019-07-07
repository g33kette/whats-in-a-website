import {getClassifier as getClassifierFromStore, saveClassifier} from './accessors';
import * as tf from '@tensorflow/tfjs';
import * as knnClassifier from '@tensorflow-models/knn-classifier';

const fixedLength = 10000;

let classifier;
const getClassifier = async () => {
    if (!classifier) {
        classifier = await getClassifierFromStore();
    }
    if (!classifier) {
        classifier = knnClassifier.create();
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
    saveClassifier(await getClassifier());
};

/**
 * Predict Classification
 *
 * @param {array} textVector
 * @return {Promise}
 */
export const predictClassification = async (textVector) => {
    const classifier = await getClassifier();
    return await classifier.predictClass(tf.tensor(fixLength(textVector)));
};

/**
 * Fix Length
 *
 * @param {array} vector
 * @return {array}
 */
function fixLength(vector) {
    if (vector.length > fixedLength) {
        return vector.slice(0, fixedLength);
    } else {
        const expanded = [];
        expanded.push(...vector);
        expanded.push(...(new Array(fixedLength-vector.length)).fill(0));
        return expanded;
    }
}
