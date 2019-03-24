# superclass
ES6 class mixin (multi class "inheritance") utility - easily extend ES6 classes from multiple classes

## install

```
npm i @specialblend/superclass
```

## quickstart

```javascript
import { superclass } from '@specialblend/superclass'

class Foo {
    getTestValue() {
        return 'test from Foo'
    }
    getFooValue() {
        return 'hello from Foo'
    }
}

class Bar {
    getTestValue() {
        return 'test from Bar'
    }
    getBarValue() {
        return 'hello from Bar'
    }
}

class Baz {
     getTestValue() {
        return 'test from Bar'
    }
    getBarValue() {
        return 'hello from Bar'
    }
    getBazValue() {
        return 'hello from Baz'
    }
}

// Extend Foo and mixin properties and methods from Bar, Baz, Faz
// Precedence for accessing properties and methods is left to right:
// SpecialFoo, Foo, Bar, ... etc
class SpecialFoo extends superclass(Foo, Bar, Baz) {
    constructor(props) {
        super(props)
    }
    getTestValue() {
        return 'test from SpecialFoo'
    }
}

const specialFoo = new SpecialFoo
specialFoo.getTestValue() // 'test from SpecialFoo'
specialFoo.getFooValue() // 'hello from Foo'
specialFoo.getBarValue() // 'hello from Bar'
specialFoo.getBazValue() // 'hello from Baz'

````

## methods

### `superclass`
```javascript
/**
 * create a Superclass from a parent class and provided sister classes
 * @param {Class} base: the base class to extend
 * @param {Array<Class>} supertypes: the sister classes
 * @returns {Class}: the created Superclass
 */
export const superclass = (base, ...supertypes) => {
```

#### example: `superclass`

```javascript
import SomeLogger from '@example/some-logger'
import { superclass } from '@specialblend/superclass'
import { EventEmitter } from 'events'

class Logger extends SomeLogger {
    info(message) {
        console.log(message);
    }
    error(message) {
        console.error(message);
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

const myEmitterLogger = new EmitterLogger

myEmitterLogger.on('error', message => {
    // message: they say it dont be like it is, but it do!
})

myEmitterLogger.error('they say it dont be like it is, but it do!')

myEmitterLogger instanceof Logger // true

```

### `mixin`

```javascript
/**
 * create a subclass of provided base class whose constructor
 * will receive arguments transformed by provided transformer function
 * @param {Class} base: the base class to extend
 * @param {Function} transform: the transformer function
 * @returns {Class}: the created subclass
 */
export const mixin = (base, transform) => {}
```

#### example: `mixin`

```javascript
import { superclass, mixin } from '@specialblend/superclass'

class SayHello {
    constructor(name) {
        console.log(`Hello ${name}`);
    }
}

class SayWhatsUp {
    constructor(name) {
        console.log(`Whats up ${name}`);
    }
}

class SayBye {
    constructor(name) {
        console.log(`Bye ${name}`);
    }
}

const ExcitedSayHello = mixin(SayHello, name => [name.toUpperCase()]);
const BoredWhatsUp = mixin(SayWhatsUp, name => [`${name}...`]);
const HatefulSayBye = mixin(SayBye, name => [`${name}. See you never!`]);
class BipolarPerson extends superclass(ExcitedSayHello, BoredWhatsUp, HatefulSayBye) {}

const myBipolarPerson = new BipolarPerson('Alice')

// Hello ALICE
// Whats up Alice...
// Bye Alice. See you never!
```
