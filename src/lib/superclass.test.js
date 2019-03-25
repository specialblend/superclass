import { EventEmitter } from 'events';
import { superclass } from './superclass';
import { mixin } from './mixin';

describe('superclass', () => {
    const __root__ = Symbol('__root__');
    const __branch__ = Symbol('__branch__');
    const __leaf__ = Symbol('__leaf__');
    const __foo__ = Symbol('__foo__');
    const __bar__ = Symbol('__bar__');
    const __baz__ = Symbol('__baz__');
    const __faz__ = Symbol('__faz__');
    const __superFoo__ = Symbol('__superFoo__');
    const __superDuperFoo__ = Symbol('__superDuperFoo__');

    class Root {
        [__root__]() {
            return __root__;
        }
    }

    class Branch {
        [__branch__]() {
            return __branch__;
        }
    }

    class Leaf extends Branch {
        [__leaf__]() {
            return __leaf__;
        }
    }

    class Parent extends Root {
        // [__root__](...args) {
        //     return super[__root__](...args);
        // }
    }

    class SaysHello extends Parent {
        constructor(message) {
            super(message);
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
            return __baz__;
        }
        [__bar__]() {
            return __baz__;
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

    class Faz extends superclass(Foo, Bar, Baz, Leaf) {
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
            expect(err.message).toMatch('base must be constructable');
        }
    });
    describe('of single defaultExport', () => {
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
                expect(typeof superFoo[__root__]).toBe('function');
            });
        });
        describe('of single defaultExport', () => {
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
                    expect(typeof superDuperFoo[__root__]).toBe('function');
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
                expect(typeof faz[__root__]).toBe('function');
                expect(typeof faz[__foo__]).toBe('function');
                expect(typeof faz[__bar__]).toBe('function');
                expect(typeof faz[__baz__]).toBe('function');
                expect(typeof faz[__leaf__]).toBe('function');
                expect(typeof faz[__branch__]).toBe('function');
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

describe('Example: EmitterLogger', () => {
    let logger;
    const consoleLog = jest.fn();
    const consoleError = jest.fn();
    const infoEvent = jest.fn();
    const errorEvent = jest.fn();
    const infoMessage = `this is a test info message - ${Math.random()}`;
    const errorMessage = `this is a test error message - ${Math.random()}`;
    class Logger {
        info(message) {
            consoleLog(message);
        }
        error(message) {
            consoleError(message);
        }
    }
    class EmitterLogger extends superclass(Logger, EventEmitter) {
        info(message) {
            super.info(message);
            this.emit('info', message);
        }
        error(message) {
            super.error(message);
            this.emit('error', message);
        }
    }
    beforeAll(() => {
        logger = new EmitterLogger;
        logger.on('info', infoEvent);
        logger.on('error', errorEvent);
        logger.info(infoMessage);
        logger.error(errorMessage);
    });
    test('is a function', () => {
        expect(EmitterLogger).toBeFunction();
    });
    test('returns instance of Logger', () => {
        expect(logger).toBeInstanceOf(Logger);
    });
    test('calls console with expected messages', () => {
        expect(consoleLog).toHaveBeenCalledWith(infoMessage);
        expect(consoleError).toHaveBeenCalledWith(errorMessage);
    });
    test('emits expected events', () => {
        expect(infoEvent).toHaveBeenCalledWith(infoMessage);
        expect(errorEvent).toHaveBeenCalledWith(errorMessage);
    });
});
