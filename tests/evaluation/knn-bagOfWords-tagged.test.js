/* eslint-disable */

import {resetStore, trainFromFiles, runClassificationEvaluation} from '../utils';
import {config as modelConfig} from '../../src/services/model';
import {config as knnConfig} from '../../src/services/models/knn';

jest.setTimeout(14400000); // 4 hours

const vectorType = 'bagOfWords';
const wordType = 'tagged';
const limit = 0;
modelConfig.modelType = 'knn';

beforeAll(async () => {
    console.log('Start Run: '+new Date());
    await resetStore();
    await trainFromFiles(
        '/tests/data/training/safe',
        '/tests/data/training/harmful',
        vectorType,
        wordType,
        limit
    );
});

beforeEach(async () => {
    console.log('Start Scenario: '+new Date());
});

afterAll( async () => {
    await resetStore();
    console.log('Complete Run: '+new Date());
});

it('Should run evaluation of model against test data for k = 1', async () => {
    knnConfig.k = 1;
    await runClassificationEvaluation('/tests/data/testing', vectorType, wordType, knnConfig.k);
});

it('Should run evaluation of model against test data for k = 3', async () => {
    knnConfig.k = 3;
    await runClassificationEvaluation('/tests/data/testing', vectorType, wordType, knnConfig.k);
});

it('Should run evaluation of model against test data for k = 5', async () => {
    knnConfig.k = 5;
    await runClassificationEvaluation('/tests/data/testing', vectorType, wordType, knnConfig.k);
});

it('Should run evaluation of model against test data for k = 10', async () => {
    knnConfig.k = 10;
    await runClassificationEvaluation('/tests/data/testing', vectorType, wordType, knnConfig.k);
});

// Not to be run until final evaluation
// it('Should run evaluation of model against validation data', async () => {
//     await runClassificationEvaluation('/tests/data/validation', vectorType, wordType, limit);
// });
