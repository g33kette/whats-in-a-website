/* eslint-disable */

import {resetStore, trainFromFiles, runClassificationEvaluation} from '../utils';

jest.setTimeout(14400000); // 4 hours

const vectorType = 'bagOfWords';
const wordType = 'plain';
const limit = 0;

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
    await runClassificationEvaluation('/tests/data/testing', vectorType, wordType, 1);
});

it('Should run evaluation of model against test data for k = 3', async () => {
    await runClassificationEvaluation('/tests/data/testing', vectorType, wordType, 3);
});

it('Should run evaluation of model against test data for k = 5', async () => {
    await runClassificationEvaluation('/tests/data/testing', vectorType, wordType, 5);
});

it('Should run evaluation of model against test data for k = 10', async () => {
    await runClassificationEvaluation('/tests/data/testing', vectorType, wordType, 10);
});

// Not to be run until final evaluation
// it('Should run evaluation of model against validation data', async () => {
//     await runClassificationEvaluation('/tests/data/validation', vectorType, wordType, limit);
// });
