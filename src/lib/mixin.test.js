import { mixin } from './mixin';

describe('mixin', () => {
    test('is a function', () => {
        expect(mixin).toBeFunction();
    });
    test('throws expected error on invalid base', () => {
        try {
            mixin('this-is;not/a~valid_class');
        } catch (err) {
            expect(err.message).toMatch('base must be constructable');
        }
    });
    test('throws expected error on invalid transformer', () => {
        try {
            mixin(Object, 'this-is;not/a~valid_transformer');
            expect(true).toBe('false');
        } catch (err) {
            expect(err.message).toMatch('transformer must be Function, null or undefined');
        }
    });
    test('throws expected error on invalid base and transformer', () => {
        try {
            mixin('this-is;not/a~valid_class', 'this-is;not/a~valid_transformer');
        } catch (err) {
            expect(err.message).toMatch('base must be constructable');
        }
    });
    test('throws expected error on invalid base and valid function transformer', () => {
        try {
            mixin('this-is;not/a~valid_class', () => {});
        } catch (err) {
            expect(err.message).toMatch('base must be constructable');
        }
    });
    describe('works as expected', () => {
        test('returns a function', () => {
            expect(mixin(Object)).toBeFunction();
        });
        test('without transformer', () => {
            class Hello {
                constructor(msg) {
                    this.message = msg;
                }
            }
            class HelloToo extends mixin(Hello) {}
            const testMessage = 'test.hello.message1234567890-';
            const hello = new Hello(testMessage);
            const helloToo = new HelloToo(testMessage);
            expect(hello).toHaveProperty('message', testMessage);
            expect(helloToo).toHaveProperty('message', testMessage);
        });
        test('with undefined transformer', () => {
            class Hello {
                constructor(msg) {
                    this.message = msg;
                }
            }
            class HelloToo extends mixin(Hello, undefined) {}
            const testMessage = 'test.hello.message1234567890-';
            const hello = new Hello(testMessage);
            const helloToo = new HelloToo(testMessage);
            expect(hello).toHaveProperty('message', testMessage);
            expect(helloToo).toHaveProperty('message', testMessage);
        });
        test('with null transformer', () => {
            class Hello {
                constructor(msg) {
                    this.message = msg;
                }
            }
            class FuckYou extends mixin(Hello, null) {}
            const testMessage = 'test.hello.message1234567890-';
            const hello = new Hello(testMessage);
            const helloToo = new FuckYou(testMessage);
            expect(hello).toHaveProperty('message', testMessage);
            expect(helloToo).toHaveProperty('message', undefined);
        });
        describe('with function transformer', () => {
            test('which returns a non-array', () => {
                class Hello {
                    constructor(msg) {
                        this.message = msg;
                    }
                }
                function toUpperCase(msg) {
                    return msg.toUpperCase();
                }
                class ExcitedHello extends mixin(Hello, toUpperCase) {}
                const testMessage = 'test.hello.message1234567890-';
                const hello = new Hello(testMessage);
                const helloToo = new ExcitedHello(testMessage);
                expect(hello).toHaveProperty('message', testMessage);
                expect(helloToo).toHaveProperty('message', testMessage.toUpperCase());
            });
            test('which returns an array', () => {
                class Person {
                    constructor(firstName, middleName, lastName) {
                        this.firstName = firstName;
                        this.middleName = middleName;
                        this.lastName = lastName;
                    }
                }
                function toUpperCase(msg) {
                    return msg.toUpperCase();
                }
                const mapNames = (...names) => names.map(toUpperCase);
                class ExcitedPerson extends mixin(Person, mapNames) {}
                const firstName = 'Jesus';
                const middleName = 'H';
                const lastName = 'Christ';
                const person = new ExcitedPerson(firstName, middleName, lastName);
                expect(person).toHaveProperty('firstName', firstName.toUpperCase());
                expect(person).toHaveProperty('middleName', middleName.toUpperCase());
                expect(person).toHaveProperty('lastName', lastName.toUpperCase());
            });
        });
    });
});
