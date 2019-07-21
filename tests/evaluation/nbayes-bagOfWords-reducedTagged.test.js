/* eslint-disable */

import {resetStore, trainFromFiles, runClassificationEvaluation} from '../utils';
import {config as modelConfig} from '../../src/services/model';

jest.setTimeout(14400000); // 4 hours

const vectorType = 'bagOfWords';
const wordType = 'reducedTagged';
const limit = 0;
modelConfig.modelType = 'nbayes';

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

it('Should run evaluation of model against test data', async () => {
    await runClassificationEvaluation('/tests/data/testing', vectorType, wordType, 1);
});

// Not to be run until final evaluation
// it('Should run evaluation of model against validation data', async () => {
//     await runClassificationEvaluation('/tests/data/validation', vectorType, wordType, limit);
// });
