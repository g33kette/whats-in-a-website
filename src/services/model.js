
import {
    trainModel as knnTrainModel,
    predictClassification as knnPredictClassification,
} from './models/knn';

import {
    trainModel as nnTrainModel,
    predictClassification as nnPredictClassification,
} from './models/nn';

import {
    trainModel as nbayesTrainModel,
    predictClassification as nbayesPredictClassification,
} from './models/nbayes';

// * Options -----------------------------------------------------------------------------------------------------------

// Exported so can be set in tests
export const config = {
    fixedLength: 10000,
    modelTypes: {
        knn: 'k-Nearest Neighbour',
        nn: 'Neural Network',
        nbayes: 'Naive Bayes',
    },
    modelType: 'knn', // Remember to re-build and clear model data if this is changed
};

// * Classifier Methods  -----------------------------------------------------------------------------------------------

export const trainModel = async (textVector, classification) => await
    config.modelType === 'knn'?knnTrainModel(textVector, classification)
    :(config.modelType === 'nn'?nnTrainModel(textVector, classification)
        :(config.modelType === 'nbayes'?nbayesTrainModel(textVector, classification)
            :null));

export const predictClassification = async (textVector) => await
    config.modelType === 'knn'?knnPredictClassification(textVector)
    :(config.modelType === 'nn'?nnPredictClassification(textVector)
        :(config.modelType === 'nbayes'?nbayesPredictClassification(textVector)
            :null));

/**
 * Fix Length
 *
 * @param {array} vector
 * @return {array}
 */
export function fixLength(vector) {
    if (vector.length > config.fixedLength) {
        return vector.slice(0, config.fixedLength);
    } else {
        const expanded = [];
        expanded.push(...vector);
        expanded.push(...(new Array(config.fixedLength-vector.length)).fill(0));
        return expanded;
    }
}
