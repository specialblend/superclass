import helloWorld from '.';

describe('hello-world', () => {
    test('helloWorld calls console.log with expected data', () => {
        helloWorld();
        expect(console.log).toHaveBeenCalledWith('Hello, world!');
    });
});
