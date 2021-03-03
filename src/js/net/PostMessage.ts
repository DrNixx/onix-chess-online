import isFunction from 'lodash/isFunction';

// A few vars used in non-awesome browsers.
let last_hash: string|null = null;
let saved_hash: string|null = null;
let cache_bust = 1;
let listenerLoop: number;

// A var used in awesome browsers.
let rm_callback: ((this: Window, ev: MessageEvent<any>) => any) | undefined = undefined;

const _postMessage = 'postMessage';

let p_receiveMessage: Function;

const has_postMessage = !!window[_postMessage];

export const postMessage = function(message: any, target_url: string, target?: Window) {
    if (!target_url) { 
        return; 
    }

    message = typeof message === 'string' ? message : JSON.stringify(message);

    // Default to parent if unspecified.
    target = target || parent;

    if (has_postMessage) {
        // The browser supports window.postMessage, so call it with a targetOrigin
        // set appropriately, based on the target_url parameter.
        var url = target_url.replace(/([^:]+:\/\/[^\/]+).*/, '$1');
        target[_postMessage](message, url);
    } else if (target_url) {
        // The browser does not support window.postMessage, so set the location
        // of the target to target_url#message. A bit ugly, but it works! A cache
        // bust parameter is added to ensure that repeat messages trigger the
        // callback.
        target.location.hash = '#' + (+new Date) + (cache_bust++) + '&' + message;
    }
};

export const receiveMessage = p_receiveMessage = function(callback: Function, source_origin: string|Function, delay: number) {
    if (has_postMessage) {
        // Since the browser supports window.postMessage, the callback will be
        // bound to the actual event associated with window.postMessage.

        if (callback) {
            // Unbind an existing callback if it exists.
            rm_callback && p_receiveMessage();

            // Bind the callback. A reference to the callback is stored for ease of unbinding.
            rm_callback = function(e: any) {
                if ((typeof source_origin === 'string' && e.origin !== source_origin)
                    || (isFunction(source_origin) && source_origin(e.origin) === false)) {
                    return false;
                }

                callback(e);
                return true;
            };

            window.addEventListener('message', rm_callback, false);
        } else {
            if (rm_callback) {
                window.removeEventListener('message', rm_callback, false);
            }
        }
    } else {
        // Since the browser sucks, a polling loop will be started, and the
        // callback will be called whenever the location.hash changes.
        listenerLoop && window.clearInterval(listenerLoop);
        listenerLoop = 0;
        saved_hash = document.location.hash;

        if (callback) {
            saved_hash = document.location.hash;
            delay = typeof source_origin === 'number' ? source_origin : typeof delay === 'number' ? delay : 100;
            listenerLoop = window.setInterval(function() {
                var hash = document.location.hash, re = /^#?\d+&/;
                if (hash !== last_hash && re.test(hash)) {
                    last_hash = hash;
                    callback({ data: hash.replace(re, '') });
                    window.clearInterval(listenerLoop);
                    document.location.hash = saved_hash!;
                }
            }, delay);
        }
    }
};
