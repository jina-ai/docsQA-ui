(function () {
    function polyfillsLoader() {
        function loadScript(src, type, attributes = []) {
            return new Promise(function (resolve) {
                var script = document.createElement('script');

                function onLoaded() {
                    if (script.parentElement) {
                        script.parentElement.removeChild(script);
                    }

                    resolve();
                }

                script.src = src;
                script.onload = onLoaded;
                attributes.forEach(att => {
                    script.setAttribute(att.name, att.value);
                });

                script.onerror = function () {
                    console.error('[polyfills-loader] failed to load: ' + src + ' check the network tab for HTTP status.');
                    onLoaded();
                };

                if (type) script.type = type;
                document.head.appendChild(script);
            });
        }

        var polyfills = [];

        if (!('noModule' in HTMLScriptElement.prototype)) {
            polyfills.push(loadScript('./polyfills/regenerator-runtime.js'));
        }

        if (!('fetch' in window)) {
            polyfills.push(loadScript('./polyfills/fetch.js'));
        }

        if (!Array.prototype.flat) {
            polyfills.push(loadScript('./polyfills/systemjs.js'));
        }

        if (!('attachShadow' in Element.prototype) || !('getRootNode' in Element.prototype) || window.ShadyDOM && window.ShadyDOM.force) {
            polyfills.push(loadScript('./polyfills/webcomponents.js'));
        }

        if (!('noModule' in HTMLScriptElement.prototype) && 'getRootNode' in Element.prototype) {
            polyfills.push(loadScript('./polyfills/custom-elements-es5-adapter.js'));
        }

        if (!('attachShadow' in Element.prototype)) {
            polyfills.push(loadScript('./polyfills/lit-polyfill-support.js'));
        }

        function loadFiles() {
            if (!Array.prototype.flat) {
                System.import('./legacy-qabot.js');
            } else {
                loadScript('./qabot.js', 'module', []);
            }
        }

        if (polyfills.length) {
            Promise.all(polyfills).then(loadFiles);
        } else {
            loadFiles();
        }
    }

    if (!('noModule' in HTMLScriptElement.prototype)) {
        var s = document.createElement('script');

        function onLoaded() {
            document.head.removeChild(s);
            polyfillsLoader();
        }

        s.src = "./polyfills/core-js.js";
        s.onload = onLoaded;

        s.onerror = function () {
            console.error('[polyfills-loader] failed to load: ' + s.src + ' check the network tab for HTTP status.');
            onLoaded();
        };

        document.head.appendChild(s);
    } else {
        polyfillsLoader();
    }
})();
