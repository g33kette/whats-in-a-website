/* eslint-disable */
import {
    prepareText,
    config as analyseContentConfig,
    updateAndReturnCorpusObject,
    bagOfWords, tfIdfVector,
} from '../../src/services/analyseContent';
import {resetStore} from '../utils';

beforeEach(async () => {
    await resetStore();
});

afterAll( async () => {
    await resetStore();
});

// Test Bag of Words Text Preparation ----------------------------------------------------------------------------------

it('Parses a simple sentence to a bag of words / plain words representation', async () => {
    analyseContentConfig.vectorType = 'bagOfWords';
    analyseContentConfig.wordType = 'plain';
    expect(await prepareText('The quick brown fox')).toEqual([1,1,1,1]);
});

it('Parses a simple sentence to a bag of words / tagged words representation', async () => {
    analyseContentConfig.vectorType = 'bagOfWords';
    analyseContentConfig.wordType = 'tagged';
    expect(await prepareText('The quick brown fox')).toEqual([1,1,1,1]);
});

it('Parses multiple simple sentences to a combined bag of words / plain words representation', async () => {
    analyseContentConfig.vectorType = 'bagOfWords';
    analyseContentConfig.wordType = 'plain';
    expect(await prepareText('The quick brown fox')).toEqual([1,1,1,1]);
    expect(await prepareText('The quick brown fox jumps over')).toEqual([1,1,1,1,1,1]);
    expect(await prepareText('The quick brown fox jumps over the lazy dog.'))
        .toEqual([2,1,1,1,1,1,1,1]);
});

it('Parses multiple simple sentences to a combined bag of words / tagged words representation', async () => {
    analyseContentConfig.vectorType = 'bagOfWords';
    analyseContentConfig.wordType = 'tagged';
    expect(await prepareText('The quick brown fox')).toEqual([1,1,1,1]);
    expect(await prepareText('The quick brown fox jumps over')).toEqual([1,1,1,1,1,1]);
    expect(await prepareText('The quick brown fox jumps over the lazy dog and the silly sheep.'))
        .toEqual([1,1,1,1,1,1,2,1,1,1,1,1]);
});

// Test TF-IDF Text Preparation ----------------------------------------------------------------------------------------

it('Parses a simple sentence to a tf-idf / plain words representation', async () => {
    analyseContentConfig.vectorType = 'tfIdf';
    analyseContentConfig.wordType = 'plain';
    expect(await prepareText('The quick brown fox')).toEqual([0.5,0.5,0.5,0.5]);
});

it('Parses a simple sentence to a tf-idf / tagged words representation', async () => {
    analyseContentConfig.vectorType = 'tfIdf';
    analyseContentConfig.wordType = 'tagged';
    expect(await prepareText('The quick brown fox')).toEqual([0.5,0.5,0.5,0.5]);
});

it('Parses multiple simple sentences to a combined tf-idf / plain words representation', async () => {
    analyseContentConfig.vectorType = 'tfIdf';
    analyseContentConfig.wordType = 'plain';
    expect(await prepareText('The quick brown fox')).toEqual([0.5,0.5,0.5,0.5]);
    expect(await prepareText('The quick brown fox jumps over')).toEqual([
        0.32177535615289915,
        0.32177535615289915,
        0.32177535615289915,
        0.32177535615289915,
        0.5412219880468178,
        0.5412219880468178,
    ]);
    expect(await prepareText('The quick brown fox jumps over the lazy dog.')).toEqual([
        0.3369607874680181,
        0.24533501901928448,
        0.24533501901928448,
        0.24533501901928448,
        0.34441786389361506,
        0.34441786389361506,
        0.4840672903116227,
        0.4840672903116227,
    ]);
});

it('Parses multiple simple sentences to a combined tf-idf / tagged words representation', async () => {
    analyseContentConfig.vectorType = 'tfIdf';
    analyseContentConfig.wordType = 'tagged';
    expect(await prepareText('The quick brown fox')).toEqual([0.5,0.5,0.5,0.5]);
    expect(await prepareText('The quick brown fox jumps over')).toEqual([
        0.32177535615289915,
        0.32177535615289915,
        0.32177535615289915,
        0.32177535615289915,
        0.5412219880468178,
        0.5412219880468178,
    ]);
    expect(await prepareText('The quick brown fox jumps over the lazy dog and the silly sheep.')).toEqual([
        0.16833389602774482,
        0.16833389602774482,
        0.16833389602774482,
        0.16833389602774482,
        0.23631848858156074,
        0.23631848858156074,
        0.4726369771631215,
        0.33213739010224125,
        0.33213739010224125,
        0.33213739010224125,
        0.33213739010224125,
        0.33213739010224125,
    ]);
});

// Test updateAndReturnCorpusObject ------------------------------------------------------------------------------------

it('Should not change corpus if items is empty', async () => {
    const originalCorpus = {
        vectorSpace: [{f: 1, item: ['the']}, {f: 1, item: ['brown']}, {f: 1, item: ['fox']}],
        numDocs: 3,
    };
    const items = [];
    const result = await updateAndReturnCorpusObject(items, originalCorpus);
    expect(result.vectorSpace).toEqual([{f: 1, item: ['the']}, {f: 1, item: ['brown']}, {f: 1, item: ['fox']}]);
    expect(result.numDocs).toEqual(4); // numDocs will increment even if empty
    // Check original has not changed
    expect(originalCorpus.vectorSpace).toEqual([{f: 1, item: ['the']}, {f: 1, item: ['brown']}, {f: 1, item: ['fox']}]);
    expect(originalCorpus.numDocs).toEqual(3);
});

it('Should update corpus only with new words', async () => {
    const originalCorpus = {
        vectorSpace: [{f: 1, item: ['the']}, {f: 1, item: ['brown']}, {f: 1, item: ['fox']}],
        numDocs: 3,
    };
    const items = ['the', 'quick', 'brown', 'fox', 'jumps', 'over', 'the', 'lazy', 'dog'];
    const result = await updateAndReturnCorpusObject(items, originalCorpus);
    expect(result.vectorSpace).toEqual([
        {f: 3, item: ['the']},
        {f: 2, item: ['brown']},
        {f: 2, item: ['fox']},
        {f: 1, item: ['quick']},
        {f: 1, item: ['jumps']},
        {f: 1, item: ['over']},
        {f: 1, item: ['lazy']},
        {f: 1, item: ['dog']},
    ]);
    expect(result.numDocs).toEqual(4); // numDocs will increment even if empty
    // Check original has not changed
    expect(originalCorpus.vectorSpace).toEqual([{f: 1, item: ['the']}, {f: 1, item: ['brown']}, {f: 1, item: ['fox']}]);
    expect(originalCorpus.numDocs).toEqual(3);
});

// Test bagOfWords Method ----------------------------------------------------------------------------------------------

it('Should return correct bag of words vector based on corpus vectorSpace', async () => {
    const corpus = {
        vectorSpace: [
            {f: 3, item: ['the']},
            {f: 2, item: ['brown']},
            {f: 2, item: ['fox']},
            {f: 1, item: ['quick']},
            {f: 1, item: ['jumps']},
            {f: 1, item: ['over']},
            {f: 1, item: ['lazy']},
            {f: 1, item: ['dog']},
        ],
    };
    const words = ['the', 'lazy', 'dog', 'jumps'];
    const result = await bagOfWords(words, corpus);
    expect(result).toEqual([1,0,0,0,1,0,1,1]);
});

// Test tfIdf Method ---------------------------------------------------------------------------------------------------

it('Should return correct tf-idf vector based on corpus', async () => {
    const corpus = {
        vectorSpace: [
            {f: 3, item: ['the']},
            {f: 2, item: ['brown']},
            {f: 2, item: ['fox']},
            {f: 1, item: ['quick']},
            {f: 1, item: ['jumps']},
            {f: 1, item: ['over']},
            {f: 1, item: ['lazy']},
            {f: 1, item: ['dog']},
        ],
        numDocs: 3,
    };
    const words = ['the', 'lazy', 'dog', 'jumps'];
    const result = await tfIdfVector(words, corpus);
    expect(result).toEqual([0.28083667479155255,0,0,0,0.5541151390857391,0,0.5541151390857391,0.5541151390857391]);
});

