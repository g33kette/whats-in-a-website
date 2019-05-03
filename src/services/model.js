import {getClassifier as getClassifierFromStore, saveClassifier} from '../background';
import * as tf from '@tensorflow/tfjs';
import * as knnClassifier from '@tensorflow-models/knn-classifier';

const fixedLength = 5000;

let classifier;
const getClassifier = () => {
    if (!classifier) {
        classifier = getClassifierFromStore();
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
export const trainModel = (textVector, classification) => {
    getClassifier().addExample(tf.tensor(fixLength(textVector)), classification);
    saveClassifier(getClassifier());
};

/**
 * Predict Classification
 *
 * @param {array} textVector
 * @return {Promise}
 */
export const predictClassification = async (textVector) =>
    await getClassifier().predictClass(tf.tensor(fixLength(textVector)));

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
        expanded.push(...(new Array(fixedLength-vector.length)));
        return expanded;
    }
}
