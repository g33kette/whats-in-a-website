/* eslint-disable */

import {resetStore, trainFromFiles, runClassificationEvaluation} from '../utils';

jest.setTimeout(7200000); // 2 hours

const vectorType = 'bagOfWords';
const wordType = 'plain';
const limit = 0;

beforeAll(async () => {
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
});

afterAll( async () => {
    await resetStore();
});

it('Should run evaluation of model against test data for k = 1', async () => {
    await runClassificationEvaluation('/tests/data/testing', vectorType, wordType, 1);
});

it('Should run evaluation of model against test data for k = 3', async () => {
    await runClassificationEvaluation('/tests/data/testing', vectorType, wordType, 3);
});

it('Should run evaluation of model against test data for k = 10', async () => {
    await runClassificationEvaluation('/tests/data/testing', vectorType, wordType, 10);
});

// Not to be run until final evaluation
// it('Should run evaluation of model against validation data', async () => {
//     await runClassificationEvaluation('/tests/data/validation', vectorType, wordType, limit);
// });
