/* eslint-disable */

import {resetStore, trainFromFiles, runClassificationEvaluation} from '../utils';

jest.setTimeout(3600000); // 1 hour

const vectorType = 'bagOfWords';
const wordType = 'plain';
const limit = 0; // 2 takes  64 sec...

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
    await runClassificationEvaluation('/tests/data/testing', vectorType, wordType, limit);
});

// Not to be run until final evaluation
// it('Should run evaluation of model against validation data', async () => {
//     await runClassificationEvaluation('/tests/data/validation', vectorType, wordType, limit);
// });
