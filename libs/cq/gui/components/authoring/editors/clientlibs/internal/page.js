(function (window, undefined) {

    window.Granite = window.Granite || {};
    window.Granite.author = window.Granite.author || {};

}(this));
(function (window, undefined) {
    "use strict";

    /**
     *
     * Granite.author.inner
     *
     * The namespace of the content frame; i.e., where the actual content to be edited lives
     * Use different namespace to avoid name conflicts with the EditorFrame object from the outside frame (the editor)
     * NB: Cannot use Granite.author.page since it is already used (and deprecated)
     *
     * @namespace
     */
    Granite.author.inner = {};

    /**
     * The "inner" EditorFrame is the object that we use on the content frame side to send messages to the editor frame
     *
     * @module
     */
    Granite.author.inner.EditorFrame = new Granite.author.MessageChannel('cqauthor', /* target */ window.parent).mixin({});

}(this));
(function (window, undefined) {

    // undocumented extension point
    Granite.author.command = {};

    // fix for location.origin (IE)
    window.location.origin = (window.location.origin ?
        window.location.origin :
        window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: ''));


    var self = Granite.author; // shortcut

    function sanitize(code) {
        try {
            eval(code);
        } catch (ex) {
            console.error(ex);
        }
    }

    function loadScript(scriptNode) {
        var newScript;

        if (scriptNode.parentNode) { // we need a parent for this
            newScript = document.createElement('script');
            newScript.setAttribute('src', scriptNode.src);

            // copy other prop
            newScript.setAttribute('type', scriptNode.getAttribute('type') || '');
            newScript.setAttribute('charset', scriptNode.getAttribute('charset') || '');
            newScript.setAttribute('onload', scriptNode.getAttribute('onload') || '');
            if (scriptNode.hasAttribute('async')) {
                newScript.setAttribute('async', scriptNode.getAttribute('async'));
            } else {
                newScript.async = false;
            }
            if (scriptNode.hasAttribute('defer')) {
                newScript.setAttribute('defer', scriptNode.getAttribute('defer'));
            } else {
                newScript.defer = false;
            }

            scriptNode.parentNode.replaceChild(newScript, scriptNode);
        }
    }

    function manipulationEnd() {
        var elem = window;

        if ('createEvent' in document) {
            var evt = document.createEvent('HTMLEvents');
            evt.initEvent('resize', false, true);
            elem.dispatchEvent(evt);
        }
        else {
            elem.fireEvent('onresize');
        }
    }

    /**
     * get config node for path <cq/>
     * @param path
     * @returns {*}
     */
    self.getEditableConfigNode = function (path) {
        var node = document.querySelectorAll('cq[data-path="' + path + '"]');
        return node.length ? node[0] : null;
    };

    /**
     * get the actual component node
     *
     * @param path
     * @returns {*}
     */
    self.getEditableNode = function (path) {
        var node = self.getEditableConfigNode(path);
        return node ? node.parentNode : null;
    };

    /**
     *
     * @param html
     * @returns {*}
     */
    self.htmlToNode = function (html) {
        var wrapper = document.createElement('div');
        wrapper.innerHTML = html;

        return wrapper.firstElementChild;
    };

    /**
     *
     * @param html
     * @returns {*}
     */
    self.htmlToNodeArray = function (html) {
        var wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        var newNodes = [],
            kids = wrapper.childNodes;

        // iterate over childNodes and pick only Elements and Comments
        for (var i=0; i < kids.length; i++) {
            if (kids[i].nodeType === 1 || kids[i] === 8) {  // use numbers because IE8 does not expose Node constants
                newNodes.push(kids[i]);
            }
        }

        return newNodes;
    };

    /**
     * execute the scripts in a node
     * @param node
     */
    self.executeScript = function (node) {
        if (node.nodeName === "SCRIPT") {
            sanitize(node.innerHTML);
        } else {
            var arr = node.getElementsByTagName('script');
            for (var n = 0; n < arr.length; n++) {
                if (arr[n].src && arr[n].src.length) { // external script
                    loadScript(arr[n]);
                } else { // inline script, only evaluate if JavaScript (or type attribute not specified)
                    if (arr[n].type === "" ||
                        arr[n].type === "text/javascript" ||
                        arr[n].type === "text/ecmascript" ||
                        arr[n].type === "application/javascript" ||
                        arr[n].type === "application/ecmascript") {
                        sanitize(arr[n].innerHTML);
                    }
                }
            }
        }
    };

    /**
     * subscribe handler for authoring commands
     * @param req
     */
    function receiveMessage(req) {
        if (self.command[req.data.cmd]) { // command existing
            if (self.command[req.data.cmd].call(window, req.data.path, {
                    'cqauthor': req.id,
                    'cmd': req.data.cmd,
                    'path': req.data.path,
                    'data': req.data.cmdData,
                    'respond': req.respond.bind(req)
                }) !== false) {

                req.respond('cqauthor-cmd', {
                    path: req.data.path,
                    cmdData: req.data || {}
                });
            }
        }
    }
    self.inner.EditorFrame.subscribeRequestMessage('cqauthor-cmd', receiveMessage);

    /**
     *
     * @param path
     * @param data
     */
    self.command['delete'] = function (path) {
        var node = self.getEditableNode(path),
            parent = node ? node.parentNode : null;

        if (parent) {
            parent.removeChild(node);
            manipulationEnd();
        }
    };

    /**
     *
     * @param path
     * @param msg
     */
    self.command['replace'] = function (path, msg) {
        var node = self.getEditableNode(path),
            parent = node ? node.parentNode : null,
            newNode = self.htmlToNode(msg.data);

        if (parent) {
            parent.replaceChild(newNode, node);
            self.executeScript(newNode);
            manipulationEnd();
        }
    };

    /**
     *
     * @param path
     * @param msg
     */
    self.command['replaceContent'] = function (path, msg) {
        var editableNode = self.getEditableNode(path),
            parent = editableNode ? editableNode.parentNode : null,
            contentNodes = self.htmlToNodeArray(msg.data),
            cfgNode = self.getEditableConfigNode(path);

        // save cfg node to append later
        cfgNode = editableNode.removeChild(cfgNode);

        // clean the rest of the inner Content
        editableNode.innerHTML = '';

        if (parent) {
            // append new content
            for (var i=0; i < contentNodes.length; i++) {
                var newNode = contentNodes[i];
                editableNode.appendChild(newNode);
                self.executeScript(newNode);
            }
            // append cfg node
            editableNode.appendChild(cfgNode);
            manipulationEnd();
        }
    };

    /**
     *
     * @param path
     * @param msg
     */
    self.command['insertBefore'] = function (path, msg) {
        var node = self.getEditableNode(path),
            parent = node ? node.parentNode : null,
            newNode = self.htmlToNode(msg.data);

        if (parent) {
            newNode = parent.insertBefore(newNode, node);
            self.executeScript(newNode);
            manipulationEnd();
        }
    };

    /**
     *
     * @param path
     * @param msg
     */
    self.command['insertAfter'] = function (path, msg) {
        var node = self.getEditableNode(path),
            nextNode = node.nextSibling,
            parent = node ? node.parentNode : null,
            newNode = self.htmlToNode(msg.data);

        if (parent && nextNode) {
            newNode = parent.insertBefore(newNode, nextNode);
            self.executeScript(newNode);
            manipulationEnd();
        } else {

        }
    };

    /**
     *
     * @param path
     * @param msg
     */
    self.command['insertLast'] = function (path, msg) {
        var node = self.getEditableNode(path),
            newNode = self.htmlToNode(msg.data);

        if (node) {
            newNode = node.appendChild(newNode);
            self.executeScript(newNode);
            manipulationEnd();
        }
    };

    var emulator;

    /**
     * emulate a device
     * @param path is ignored
     * @param config device configuration to emulate
     */
    self.command['emulate'] = function (path, msg) {
        var cfg = msg.data,
            w = cfg.width;

        if (!emulator) {
            emulator = new Granite.author.MediaEmulator(document);
        }

        if (cfg.rotated) {
            cfg.width = cfg.height;
            cfg.height = w;
        }

        cfg = emulator.prepareDevice(cfg);

        emulator.applyDevice(cfg);

        msg.respond('cqauthor-cmd', {
            cmdData: cfg
        });

        return false; // block default inform response
    };

    /**
     *
     * restores the rendering to the native representation
     */
    self.command['resetEmulate'] = function () {

        if (!emulator) {
            emulator = new Granite.author.MediaEmulator(document);
        }

        emulator.restore();
    };

    /**
     * Toggles a class in the document
     * @param path ignored
     * @param msg {Object}
     * @param msg.className {String} css class to be applied/removed
     * @param [msg.condition] {Boolean} force a condition
     * @param [msg.selector] {String} selector string for a target element,
     *          if the selector returns multiple elements, just the first one will be used
     *          if not passed the document.documentElement will be used
     */
    self.command['toggleClass'] = function (path, msg) {

        var cmd = msg.data,
            target, appendClass, hasClass;

        if (path) {
            target = self.getEditableNode(path);
        } else {
            target =  cmd.selector ? document.querySelectorAll(cmd.selector)[0] : document.documentElement;
        }


        if (target) {
            hasClass = target.className.indexOf(cmd.className) !== -1;

            appendClass = cmd.condition === false ? false :
                cmd.condition === true ? true :
                    hasClass ? false : true;

            if (appendClass && !hasClass) {
                target.className += ' ' + cmd.className;
            } else if (!appendClass && hasClass) {
                target.className = target.className.replace(cmd.className, '');
            }
        }
    };

}(this));
/*
 * ADOBE CONFIDENTIAL
 *
 * Copyright 2015 Adobe Systems Incorporated
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 */
;(function (window, undefined) {
    'use strict';

    function reposition() {
        /**
         * Triggered when the layout of the iframe #ContentFrame has changed
         *
         * It's critical to throttle or debounce this message as it will be call on resize events as well
         *
         * @postMessage cq-contentframe-layout-change
         */
        Granite.author.inner.EditorFrame.postMessage('cq-contentframe-layout-change', null, -1);
    }

    var observer = new MutationObserver(reposition);

    document.addEventListener('DOMContentLoaded', function(ev) {
        observer.observe(document.body, {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true  // To catch style changes on child elements too
        });

        document.addEventListener('load', reposition, true);
        window.addEventListener('resize', reposition, true);
    });

}(this));
/*
 * ADOBE CONFIDENTIAL
 *
 * Copyright 2016 Adobe Systems Incorporated
 * All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 */
(function (window, undefined) {

    Granite.author.command = Granite.author.command || {};

    Granite.author.command['requestFragmentIdentifierChanges'] = function() {

        /**
         * Triggered when the fragment identifier (hash) in the ContentFrame has changed.
         *
         * @postMessage cq-contentframe-fragment-identifier-change
         */
        var hashChangeDetected = function() {
            var fragmentIdentifierPath = window.location.hash;

            // fragmentIdentifierPath will either be the empty string, or start with '#'
            if (fragmentIdentifierPath.indexOf('#') === 0) {
                // remove the # prefix
                fragmentIdentifierPath = fragmentIdentifierPath.substring(1);
            }

            Granite.author.inner.EditorFrame.postMessage('cq-contentframe-fragment-identifier-change', {
                path: fragmentIdentifierPath
            }, -1);
        };

        window.addEventListener("hashchange", hashChangeDetected, false);

        // call hashChangeDetected once to set the initial fragment identifier path
        hashChangeDetected();
    };

}(this));