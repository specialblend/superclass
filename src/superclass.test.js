/* eslint-disable new-cap */

import { mixin, superclass } from './superclass';

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

    }
}

class Bar extends SaysHello {
    [__bar__]() {

    }
}

class Baz extends SaysHello {
    [__baz__]() {

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

describe('superclass', () => {
    test('is a function', () => {
        expect(superclass).toBeFunction();
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
        });
    });
});
