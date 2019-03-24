/* eslint-disable new-cap */

import { mixin, superclass, SuperclassError } from './superclass';

describe('mixin', () => {
    test('is a function', () => {
        expect(mixin).toBeFunction();
    });
    test('throws expected error on invalid base', () => {
        try {
            mixin('this-is;not/a~valid_class');
        } catch (err) {
            expect(err).toBeInstanceOf(SuperclassError);
            expect(err.message).toMatchSnapshot();
        }
    });
    test('throws expected error on invalid transformer', () => {
        try {
            mixin(Object, 'this-is;not/a~valid_transformer');
        } catch (err) {
            expect(err).toBeInstanceOf(SuperclassError);
            expect(err.message).toMatchSnapshot();
        }
    });
    test('throws expected error on invalid transformer result', () => {
        try {
            new class extends mixin(Object, () => null) {};
        } catch (err) {
            expect(err).toBeInstanceOf(SuperclassError);
            expect(err.message).toMatchSnapshot();
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
        test('with function transformer', () => {
            class Hello {
                constructor(msg) {
                    this.message = msg;
                }
            }
            class ExcitedHello extends mixin(Hello, msg => [msg.toUpperCase()]) {}
            const testMessage = 'test.hello.message1234567890-';
            const hello = new Hello(testMessage);
            const helloToo = new ExcitedHello(testMessage);
            expect(hello).toHaveProperty('message', testMessage);
            expect(helloToo).toHaveProperty('message', testMessage.toUpperCase());
        });
    });
});

describe('superclass', () => {
    const __foo__ = Symbol('__foo__');
    const __bar__ = Symbol('__bar__');
    const __baz__ = Symbol('__baz__');
    const __faz__ = Symbol('__faz__');
    const __superFoo__ = Symbol('__superFoo__');
    const __superDuperFoo__ = Symbol('__superDuperFoo__');

    class SaysHello {
        constructor(message) {
            this.message = message;
            if (typeof this.messages === 'undefined') {
                this.messages = {};
            }
            this.messages[this.constructor.name] = message;
            this[this.constructor.name] = () => this.constructor.name;
        }
        hello() {
            const {
                message,
                messages: { [this.constructor.name]: namedMessage },
            } = this;
            return {
                message,
                namedMessage,
            };
        }
    }

    class Foo extends SaysHello {
        [__foo__]() {
            return __foo__;
        }
    }

    class Bar extends SaysHello {
        [__foo__]() {
            return __bar__;
        }
        [__bar__]() {
            return __bar__;
        }
    }

    class Baz extends SaysHello {
        [__foo__]() {
            return __bar__;
        }
        [__bar__]() {
            return __bar__;
        }
        [__baz__]() {
            return __baz__;
        }
    }

    class SuperFoo extends superclass(Foo) {
        [__superFoo__]() {

        }
    }

    class SuperDuperFoo extends superclass(SuperFoo) {
        [__superDuperFoo__]() {

        }
    }

    class Faz extends superclass(Foo, Bar, Baz) {
        [__faz__]() {

        }
    }

    const message = 'They say it dont be like it is, but it do!';
    const superFoo = new SuperFoo(message);
    const superDuperFoo = new SuperDuperFoo(message);
    const faz = new Faz(message);
    test('is a function', () => {
        expect(superclass).toBeFunction();
    });
    test('throws expected error on invalid base', () => {
        try {
            superclass('this-is;not/a~valid_class');
        } catch (err) {
            expect(err).toBeInstanceOf(SuperclassError);
            expect(err.message).toMatchSnapshot();
        }
    });
    describe('of single Superclass', () => {
        test('returns a function', () => {
            expect(SuperFoo).toBeFunction();
        });
        describe('instance', () => {
            test('has expected own props', () => {
                expect(typeof superFoo[__superFoo__]).toBe('function');
                expect(superFoo).toHaveProperty('message', message);
                expect(superFoo).toHaveProperty('messages', expect.any(Object));
                expect(superFoo.messages).toHaveProperty('SuperFoo', message);
                expect(superFoo).toHaveProperty('SuperFoo', expect.any(Function));
                expect(superFoo.SuperFoo()).toBe('SuperFoo');
                expect(superFoo).toHaveProperty('hello', expect.any(Function));
                expect(superFoo.hello()).toMatchObject({
                    message,
                    namedMessage: message,
                });
            });
            test('has expected super props', () => {
                expect(typeof superFoo[__foo__]).toBe('function');
            });
        });
        describe('of single Superclass', () => {
            test('returns a function', () => {
                expect(SuperDuperFoo).toBeFunction();
            });
            describe('instance', () => {
                test('has expected props', () => {
                    expect(typeof superDuperFoo[__superDuperFoo__]).toBe('function');
                    expect(superDuperFoo).toHaveProperty('message', message);
                    expect(superDuperFoo).toHaveProperty('messages', expect.any(Object));
                    expect(superDuperFoo.messages).toHaveProperty('SuperDuperFoo', message);
                    expect(superDuperFoo).toHaveProperty('SuperDuperFoo', expect.any(Function));
                    expect(superDuperFoo.SuperDuperFoo()).toBe('SuperDuperFoo');
                    expect(superDuperFoo).toHaveProperty('hello', expect.any(Function));
                    expect(superDuperFoo.hello()).toMatchObject({
                        message,
                        namedMessage: message,
                    });
                });
                test('has expected super props', () => {
                    expect(typeof superDuperFoo[__superFoo__]).toBe('function');
                    expect(typeof superDuperFoo[__foo__]).toBe('function');
                });
            });
        });
    });
    describe('of multiple Superclasses', () => {
        test('returns a function', () => {
            expect(Faz).toBeFunction();
        });
        describe('instance', () => {
            test('has expected own props', () => {
                expect(typeof faz[__faz__]).toBe('function');
                expect(faz).toHaveProperty('message', message);
                expect(faz).toHaveProperty('messages', expect.any(Object));
                expect(faz.messages).toHaveProperty('Faz', message);
                expect(faz).toHaveProperty('Faz', expect.any(Function));
                expect(faz.Faz()).toBe('Faz');
                expect(faz).toHaveProperty('hello', expect.any(Function));
                expect(faz.hello()).toMatchObject({
                    message,
                    namedMessage: message,
                });
            });
            test('has expected super props', () => {
                expect(typeof faz[__foo__]).toBe('function');
                expect(typeof faz[__bar__]).toBe('function');
                expect(typeof faz[__baz__]).toBe('function');
            });
            test('respects order of operations', () => {
                expect(faz[__foo__]()).toBe(__foo__);
                expect(faz[__bar__]()).toBe(__bar__);
                expect(faz[__baz__]()).toBe(__baz__);
            });
        });
    });
    describe('works as expected with mixins', () => {
        const say = jest.fn();
        class SayHello {
            constructor(name) {
                say(`Hello ${name}`);
            }
        }
        class SayWhatsUp {
            constructor(name) {
                say(`Whats up ${name}`);
            }
        }
        class SayBye {
            constructor(name) {
                say(`Bye ${name}`);
            }
        }
        const ExcitedSayHello = mixin(SayHello, name => [name.toUpperCase()]);
        const BoredWhatsUp = mixin(SayWhatsUp, name => [`${name}...`]);
        const HatefulSayBye = mixin(SayBye, name => [`${name}. See you never!`]);
        class BipolarPerson extends superclass(ExcitedSayHello, BoredWhatsUp, HatefulSayBye) {}
        test('calls say with expected data', () => {
            new BipolarPerson('John Smith');
            expect(say).toHaveBeenCalledWith('Hello JOHN SMITH');
            expect(say).toHaveBeenCalledWith('Whats up John Smith...');
            expect(say).toHaveBeenCalledWith('Bye John Smith. See you never!');
        });
    });
});
