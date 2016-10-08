/**
 * Copyright (c) 2016-current, Isiah Meadows.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 * OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */

/**
 * This is a primitive JS module loader that only supports local modules.
 */

this.r || (function (r, init, modules, factories) { // eslint-disable-line
    "use strict"

    init.prototype = null
    modules = new init() // eslint-disable-line new-cap
    factories = new init() // eslint-disable-line new-cap

    r.defined = function (name) {
        return name in modules
    }

    r.required = function (name) {
        return name in modules && !(name in factories)
    }

    r.unload = function (name) {
        delete modules[name]
        // This probably doesn't exist, but just in case
        delete factories[name]
    }

    r.require = function (name) {
        if (!(name in modules)) {
            throw Error("Could not find module: " + name)
        }

        if (name in factories) {
            var res = factories[name]

            delete factories[name]
            res = res(modules[name])
            modules[name] = res != null ? res : modules[name]
        }

        return modules[name]
    }

    r.module = function (name, value) {
        if (name in modules) {
            throw Error("Module already defined: " + name)
        }

        modules[name] = value != null ? value : {}
        // This probably doesn't exist, but just in case
        delete factories[name]
    }

    r.define = function (name, impl) {
        if (name in modules) {
            throw Error("Module already defined: " + name)
        }

        modules[name] = {}
        factories[name] = impl
    }
})(this.r = {}, function () {}) // eslint-disable-line
