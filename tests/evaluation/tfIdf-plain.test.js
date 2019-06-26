/* eslint-disable */

import {resetStore, trainFromFiles, runClassificationEvaluation} from '../utils';

jest.setTimeout(7200000); // 2 hours

const vectorType = 'tfIdf';
const wordType = 'plain';
const limit = 0; // ~ 100 minutes...

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

it('Should run evaluation of model against test data', async () => {
    await runClassificationEvaluation('/tests/data/testing', vectorType, wordType);
});

// Not to be run until final evaluation
// it('Should run evaluation of model against validation data', async () => {
//     await runClassificationEvaluation('/tests/data/validation', vectorType, wordType, limit);
// });
