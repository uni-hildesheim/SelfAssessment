const JSONUtils = require('../../app/utils/json');

describe('JSONUtils', () => {
    beforeEach( () => {
        // dummy
    });

    afterEach( () => {
        // dummy
    });

    describe('resolveReferencesinString(input, references)', () => {
        it('should correctly replace references in a string', () => {
            const input = 'Roses are ?ref{1001}. Violets are ?ref{1002}.';
            const references = {
                '1001': 'red',
                '1002': 'blue'
            };

            const output = JSONUtils.resolveReferencesinString(input, references);

            expect(output).toEqual('Roses are red. Violets are blue.');
        });
    });

    describe('resolveReferences(input, references)', () => {
        it('should recursively replace references in an object', () => {
            const input = {
                /* single string */
                first: 'Roses are ?ref{1001}.',
                /* nested object */
                second: {
                    second: 'Violets are ?ref{1002}.',
                },
                /* 2nd level nested object */
                third: {
                    third: {
                        third: 'Bananas are ?ref{1003}.'
                    }
                },
                /* nested array */
                fourth: ['Apples are ?ref{1004}.'],
                /* nested object inside array */
                fifth: [{
                    fifth: 'Oranges are ?ref{1005}.'
                }],
            }

            const references = {
                '1001': 'red',
                '1002': 'blue',
                '1003': 'tasty',
                '1004': 'sour or sweet',
                '1005': 'juicy'
            };

            const result = JSONUtils.resolveReferences(input, references);

            expect(result).toBeTruthy();
            expect(input.first).toEqual('Roses are red.');
            expect(input.second.second).toEqual('Violets are blue.');
            expect(input.third.third.third).toEqual('Bananas are tasty.');
            expect(input.fourth).toEqual(['Apples are sour or sweet.']);
            expect(input.fifth[0].fifth).toEqual('Oranges are juicy.');
        });
    });

    describe('mergeObjects(input)', () => {
        it('should merge two JSONs into one', () => {
            const input = [
                {
                    'key1': 'value1',
                    'key2': '?ref{1002}'
                },
                {
                    'key3': 'value3',
                    '?refs': {
                        '1002': 'value2'
                    }
                }
            ];

            const expectedOutput = {
                'key1': 'value1',
                'key2': 'value2',
                'key3': 'value3'
            };

            const output = JSONUtils.mergeObjects(input);

            expect(output).not.toBeNull;
            expect(output).toEqual(expectedOutput);
        });
    });
});
