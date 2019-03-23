describe('index.js', () => {
    test('index.js exports correctly', () => {
        const index = require('.');
        expect(typeof index).toBe('object');
        expect(index).toHaveProperty('default');
        expect(typeof index.default).toBe('function');
    });
});
