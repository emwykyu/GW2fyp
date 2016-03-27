/*!
 * gw2Api.js 0.5.0
 * https://github.com/dyanarose/gw2Api.js
 * Copyright 2015-2015 Dyana Rose; Licensed MIT
 */

(function(root, factory) {
    if (typeof define === "function" && define.amd) {
        define("gw2Api", [ "Q" ], function(a0) {
            return root["gw2Api"] = factory(a0);
        });
    } else if (typeof exports === "object") {
        module.exports = factory(require("Q"));
    } else {
        root["gw2Api"] = factory(Q);
    }
})(this, function(Q) {
    var gw2Api = {};
    function Error(message) {
        "use strict";
        this.message = message;
    }
    var ajax;
    (function() {
        "use strict";
        ajax = {
            get: get
        };
        function get(url, headers) {
            var oReq = createRequest(url, headers);
            if (gw2Api.config.withCredentials) {
                oReq.withCredentials = true;
            }
            return setPromise(oReq);
        }
        function createRequest(url, headers) {
            var oReq = new XMLHttpRequest(), headerArray = headers;
            oReq.open("GET", url, true);
            if (headers) {
                if (!gw2Api.utils.checks.isArray(headers)) {
                    headerArray = [ headers ];
                }
                setHeaders(oReq, headerArray);
            }
            oReq.responseType = "json";
            return oReq;
        }
        function setHeaders(req, headerArray) {
            var i, header;
            for (i = 0; i < headerArray.length; i++) {
                header = headerArray[i];
                for (var prop in header) {
                    if (header.hasOwnProperty(prop)) {
                        req.setRequestHeader(prop, header[prop]);
                    }
                }
            }
        }
        function setPromise(xhr) {
            var deferred = Q.defer(), promise = deferred.promise, status, aborted = -1, timeoutId;
            xhr.onreadystatechange = function() {
                var response, responseHeaders, rawHeaders, gwHeaders, promiseResult;
                if (xhr.readyState == 4) {
                    if (status !== aborted) {
                        responseHeaders = xhr.getAllResponseHeaders();
                        response = xhr.responseType ? xhr.response : xhr.responseText;
                    }
                    timeoutId && clearTimeout(timeoutId);
                    status = status || xhr.status;
                    xhr = null;
                    status = Math.max(status == 1223 ? 204 : status, 0);
                    rawHeaders = headersGetter(responseHeaders)();
                    gwHeaders = createGwHeaders(rawHeaders);
                    promiseResult = isSuccess(status) ? deferred.resolve : deferred.reject;
                    promiseResult({
                        data: response,
                        status: status,
                        rawHeaders: rawHeaders,
                        headers: gwHeaders
                    });
                }
            };
            xhr.onprogress = function(progress) {
                deferred.notify(progress);
            };
            xhr.send();
            if (gw2Api.config.timeout > 0) {
                timeoutId = setTimeout(function() {
                    status = aborted;
                    xhr && xhr.abort();
                }, gw2Api.config.timeout);
            }
            function lowercase(str) {
                return (str || "").toLowerCase();
            }
            function createGwHeaders(rawHeaders) {
                var xPageSize, xPageTotal, xResultCount, xResultTotal;
                xPageSize = rawHeaders["x-page-size"];
                xPageTotal = rawHeaders["x-page-total"];
                xResultCount = rawHeaders["x-result-count"];
                xResultTotal = rawHeaders["x-result-total"];
                return responseHeader(xPageSize, xPageTotal, xResultCount, xResultTotal);
            }
            function parseHeaders(headers) {
                var parsed = {}, key, val, i;
                if (!headers) {
                    return parsed;
                }
                headers.split("\n").forEach(function(line) {
                    i = line.indexOf(":");
                    key = lowercase(line.substr(0, i).trim());
                    val = line.substr(i + 1).trim();
                    if (key) {
                        if (parsed[key]) {
                            parsed[key] += ", " + val;
                        } else {
                            parsed[key] = val;
                        }
                    }
                });
                return parsed;
            }
            function headersGetter(headers) {
                var headersObj = typeof headers === "object" ? headers : undefined;
                return function(name) {
                    if (!headersObj) {
                        headersObj = parseHeaders(headers);
                    }
                    if (name) {
                        return headersObj[lowercase(name)];
                    }
                    return headersObj;
                };
            }
            return promise;
        }
        function isSuccess(status) {
            return 200 <= status && status < 300;
        }
    })();
    var utils;
    (function() {
        "use strict";
        utils = {
            converters: converters(),
            checks: checks(),
            format: strFormat,
            splitIdentifier: splitIdentifier
        };
        function splitIdentifier(name, endpoint, eps) {
            var nameArray, index, leaf, lastNodeIndex, node, part;
            nameArray = name.split(".");
            lastNodeIndex = nameArray.length - 1;
            leaf = nameArray[lastNodeIndex];
            node = eps;
            for (index = 0; index < lastNodeIndex; index++) {
                part = nameArray[index];
                if (node[part]) {
                    node = node[part];
                    continue;
                }
                node[part] = {};
                node = node[part];
            }
            node[nameArray[lastNodeIndex]] = endpoint;
        }
        function strFormat(format) {
            var args = Array.prototype.slice.call(arguments, 1);
            return format.replace(/{(\d+)}/g, function(match, number) {
                return typeof args[number] !== "undefined" ? args[number] : match;
            });
        }
        function converters() {
            return {
                toInt: toInt
            };
        }
        function checks() {
            return {
                notEmpty: notEmpty,
                isNumber: isNumber,
                isArray: Array.isArray,
                isString: isString
            };
        }
        function notEmpty(value) {
            var trimmed;
            if (!value && value !== 0) {
                return false;
            }
            trimmed = value.toString().trim;
            return !!trimmed;
        }
        function isString(value) {
            return typeof value === "string";
        }
        function isNumber(value) {
            return typeof value === "number";
        }
        function toInt(num) {
            var asInt, isInt;
            isInt = num.toString().match(/^-?\d+$/gm);
            if (!isInt) {
                throw new Error("value must be a number");
            }
            asInt = parseInt(num, 10);
            if (isNaN(asInt) || !isNumber(asInt)) {
                throw new Error("value must be a number");
            }
            return asInt;
        }
    })();
    (function() {
        gw2Api.config = configuration();
        function configuration() {
            "use strict";
            var url = "https://api.guildwars2.com", prefix = {
                v2: "/v2/"
            };
            return {
                createUrl: createUrl,
                defaultLang: null
            };
            function createUrl(location) {
                return url + prefix.v2 + location;
            }
        }
    })();
    function responseHeader(pSize, pTotal, rCount, rTotal) {
        "use strict";
        var xPageSize, xPageTotal, xResultCount, xResultTotal;
        xPageSize = pSize;
        xPageTotal = pTotal;
        xResultCount = rCount;
        xResultTotal = rTotal;
        return {
            get pageSize() {
                return xPageSize;
            },
            get pageTotal() {
                return xPageTotal;
            },
            get resultCount() {
                return xResultCount;
            },
            get resultTotal() {
                return xResultTotal;
            }
        };
    }
    (function() {
        "use strict";
        gw2Api.params = {
            CommonParams: CommonParams,
            AuthParams: AuthParams,
            IdAuthParams: IdAuthParams,
            IdParams: IdParams,
            CharacterParams: CharacterParams,
            IdsAuthParams: IdsAuthParams,
            IdsParams: IdsParams,
            QuantityParams: QuantityParams,
            FloorParams: FloorParams,
            RegionParams: RegionParams,
            MapParams: MapParams,
            SectorParams: SectorParams,
            PoiParams: PoiParams,
            TaskParams: TaskParams,
            RecipeSearchParams: RecipeSearchParams
        };
        function CommonParams() {
            var lang, pge, pgeSize, token;
            lang = gw2Api.config.defaultLang;
            this.type = "CommonParams";
            Object.defineProperty(this, "lang", {
                get: function() {
                    return lang;
                },
                set: function(value) {
                    lang = value;
                },
                enumerable: true
            });
            Object.defineProperty(this, "page", {
                get: function() {
                    return pge;
                },
                set: function(value) {
                    pge = checkAndConvert(value);
                },
                enumerable: true
            });
            Object.defineProperty(this, "pageSize", {
                get: function() {
                    return pgeSize;
                },
                set: function(value) {
                    pgeSize = checkAndConvert(value);
                },
                enumerable: true
            });
            function checkAndConvert(value) {
                if (!utils.checks.notEmpty(value)) {
                    return null;
                }
                return utils.converters.toInt(value);
            }
        }
        CommonParams.prototype.url = function url(urlFormat, paramType) {
            var qs;
            if (this.type === paramType) {
                qs = this.getQueryString();
            }
            if (qs) {
                return urlFormat + "?" + qs;
            }
            return urlFormat;
        };
        CommonParams.prototype.getQueryString = function getQueryString() {
            var params = [];
            if (this.lang) {
                params.push("lang=" + this.lang);
            }
            if (this.page || this.page === 0) {
                params.push("page=" + this.page);
            }
            if (this.pageSize) {
                params.push("page_size=" + this.pageSize);
            }
            return params.join("&");
        };
        function AuthParams() {
            var token;
            CommonParams.apply(this, arguments);
            this.type = "AuthParams";
            Object.defineProperty(this, "token", {
                get: function() {
                    return token;
                },
                set: function(value) {
                    token = value;
                },
                enumerable: true
            });
        }
        AuthParams.prototype.url = CommonParams.prototype.url;
        AuthParams.prototype.getQueryString = function getQueryStringId() {
            return CommonParams.prototype.getQueryString.call(this);
        };
        function IdAuthParams() {
            var id;
            AuthParams.apply(this, arguments);
            this.type = "IdAuthParams";
            Object.defineProperty(this, "id", {
                get: function() {
                    return id;
                },
                set: function(value) {
                    id = checkAndConvert(value);
                },
                enumerable: true
            });
            function checkAndConvert(value) {
                if (!utils.checks.notEmpty(value)) {
                    return null;
                }
                if (utils.checks.isString(value) || utils.checks.isNumber(value)) {
                    return value;
                }
                throw new Error("value must be a number or string");
            }
        }
        IdAuthParams.prototype.url = AuthParams.prototype.url;
        IdAuthParams.prototype.getQueryString = function getQueryStringId() {
            var params = [];
            var pQueryString = AuthParams.prototype.getQueryString.call(this);
            if (pQueryString) {
                params.push(pQueryString);
            }
            if (this.id || this.id === 0) {
                params.push("id=" + this.id);
            }
            return params.join("&");
        };
        function IdParams() {
            var id;
            CommonParams.apply(this, arguments);
            this.type = "IdParams";
            Object.defineProperty(this, "id", {
                get: function() {
                    return id;
                },
                set: function(value) {
                    id = checkAndConvert(value);
                },
                enumerable: true
            });
            function checkAndConvert(value) {
                if (!utils.checks.notEmpty(value)) {
                    return null;
                }
                if (utils.checks.isString(value) || utils.checks.isNumber(value)) {
                    return value;
                }
                throw new Error("value must be a number or string");
            }
        }
        IdParams.prototype.url = CommonParams.prototype.url;
        IdParams.prototype.getQueryString = function getQueryStringId() {
            var params = [];
            var pQueryString = CommonParams.prototype.getQueryString.call(this);
            if (pQueryString) {
                params.push(pQueryString);
            }
            if (this.id || this.id === 0) {
                params.push("id=" + this.id);
            }
            return params.join("&");
        };
        function CharacterParams() {
            var idset;
            IdAuthParams.apply(this, arguments);
            this.type = "CharacterParams";
        }
        CharacterParams.prototype.url = function characterParamsUrl(urlFormat, paramType) {
            var url = AuthParams.prototype.url.call(this, urlFormat, paramType);
            url = utils.format(url, this.id);
            return url;
        };
        CharacterParams.prototype.getQueryString = function getQueryStringIds() {
            var params = [];
            var pQueryString = AuthParams.prototype.getQueryString.call(this);
            if (pQueryString) {
                params.push(pQueryString);
            }
            return params.join("&");
        };
        function IdsAuthParams() {
            var idset;
            IdAuthParams.apply(this, arguments);
            this.type = "IdsAuthParams";
            this.add = add;
            Object.defineProperty(this, "ids", {
                get: function() {
                    return idset;
                },
                set: function(value) {
                    idset = getValueAsArray(value);
                },
                enumerable: true
            });
            function getValueAsArray(value) {
                if (!value && value !== 0) {
                    return null;
                }
                if (utils.checks.isArray(value)) {
                    return value;
                } else if (utils.checks.isString(value)) {
                    return value.split(",");
                } else if (utils.checks.isNumber(value)) {
                    return [ value ];
                }
                throw new Error('value must be an array, number, string or "all"');
            }
            function add(value) {
                var valSet = getValueAsArray(value);
                if (!valSet) {
                    return;
                }
                if (idset) {
                    idset.concat(valSet);
                } else {
                    idset = valSet;
                }
            }
        }
        IdsAuthParams.prototype.url = IdAuthParams.prototype.url;
        IdsAuthParams.prototype.getQueryString = function getQueryStringIds() {
            var params = [];
            var pQueryString = IdAuthParams.prototype.getQueryString.call(this);
            if (pQueryString) {
                params.push(pQueryString);
            }
            if (!this.ids || !this.ids.length) {
                return params.join("&");
            }
            params.push("ids=" + this.ids.join(","));
            return params.join("&");
        };
        function IdsParams() {
            var idset;
            IdParams.apply(this, arguments);
            this.type = "IdsParams";
            this.add = add;
            Object.defineProperty(this, "ids", {
                get: function() {
                    return idset;
                },
                set: function(value) {
                    idset = getValueAsArray(value);
                },
                enumerable: true
            });
            function getValueAsArray(value) {
                if (!value && value !== 0) {
                    return null;
                }
                if (utils.checks.isArray(value)) {
                    return value;
                } else if (utils.checks.isString(value)) {
                    return value.split(",");
                } else if (utils.checks.isNumber(value)) {
                    return [ value ];
                }
                throw new Error('value must be an array, number, string or "all"');
            }
            function add(value) {
                var valSet = getValueAsArray(value);
                if (!valSet) {
                    return;
                }
                if (idset) {
                    idset.concat(valSet);
                } else {
                    idset = valSet;
                }
            }
        }
        IdsParams.prototype.url = IdParams.prototype.url;
        IdsParams.prototype.getQueryString = function getQueryStringIds() {
            var params = [];
            var pQueryString = IdParams.prototype.getQueryString.call(this);
            if (pQueryString) {
                params.push(pQueryString);
            }
            if (!this.ids || !this.ids.length) {
                return params.join("&");
            }
            params.push("ids=" + this.ids.join(","));
            return params.join("&");
        };
        function QuantityParams() {
            var iden;
            CommonParams.apply(this, arguments);
            this.type = "QuantityParams";
            Object.defineProperty(this, "quantity", {
                get: function() {
                    return iden;
                },
                set: function(value) {
                    iden = checkAndConvert(value);
                },
                enumerable: true
            });
            function checkAndConvert(value) {
                if (!utils.checks.notEmpty(value)) {
                    return null;
                }
                if (utils.checks.isString(value)) {
                    return value;
                }
                return utils.converters.toInt(value);
            }
        }
        QuantityParams.prototype.url = IdsParams.prototype.url;
        QuantityParams.prototype.getQueryString = function getQueryStringQuantity() {
            var params = [], pQueryString = CommonParams.prototype.getQueryString.call(this);
            if (pQueryString) {
                params.push(pQueryString);
            }
            if (this.quantity) {
                params.push("quantity=" + this.quantity);
            }
            return params.join("&");
        };
        function FloorParams() {
            var continent;
            IdsParams.apply(this, arguments);
            this.type = "FloorParams";
            Object.defineProperty(this, "continent", {
                get: function() {
                    return continent;
                },
                set: function(value) {
                    continent = checkAndConvert(value);
                },
                enumerable: true
            });
            function checkAndConvert(value) {
                if (!utils.checks.notEmpty(value)) {
                    return null;
                }
                if (utils.checks.isString(value)) {
                    return value;
                }
                return utils.converters.toInt(value);
            }
        }
        FloorParams.prototype.url = function floorParamsUrl(urlFormat, paramType) {
            var url = IdsParams.prototype.url.call(this, urlFormat, paramType);
            url = utils.format(url, this.continent);
            return url;
        };
        FloorParams.prototype.getQueryString = function getQueryStringIds() {
            var params = [];
            var pQueryString = IdsParams.prototype.getQueryString.call(this);
            if (pQueryString) {
                params.push(pQueryString);
            }
            return params.join("&");
        };
        function RegionParams() {
            var floor;
            FloorParams.apply(this, arguments);
            this.type = "RegionParams";
            Object.defineProperty(this, "floor", {
                get: function() {
                    return floor;
                },
                set: function(value) {
                    floor = checkAndConvert(value);
                },
                enumerable: true
            });
            function checkAndConvert(value) {
                if (!utils.checks.notEmpty(value)) {
                    return null;
                }
                if (utils.checks.isString(value)) {
                    return value;
                }
                return utils.converters.toInt(value);
            }
        }
        RegionParams.prototype.url = function regionParamsUrl(urlFormat, paramType) {
            var url = IdsParams.prototype.url.call(this, urlFormat, paramType);
            url = utils.format(url, this.continent, this.floor);
            return url;
        };
        RegionParams.prototype.getQueryString = FloorParams.prototype.getQueryString;
        function MapParams() {
            var region;
            RegionParams.apply(this, arguments);
            this.type = "MapParams";
            Object.defineProperty(this, "region", {
                get: function() {
                    return region;
                },
                set: function(value) {
                    region = checkAndConvert(value);
                },
                enumerable: true
            });
            function checkAndConvert(value) {
                if (!utils.checks.notEmpty(value)) {
                    return null;
                }
                if (utils.checks.isString(value)) {
                    return value;
                }
                return utils.converters.toInt(value);
            }
        }
        MapParams.prototype.url = function mapParamsUrl(urlFormat, paramType) {
            var url = IdsParams.prototype.url.call(this, urlFormat, paramType);
            url = utils.format(url, this.continent, this.floor, this.region);
            return url;
        };
        MapParams.prototype.getQueryString = RegionParams.prototype.getQueryString;
        function SectorParams() {
            var map;
            MapParams.apply(this, arguments);
            this.type = "SectorParams";
            Object.defineProperty(this, "map", {
                get: function() {
                    return map;
                },
                set: function(value) {
                    map = checkAndConvert(value);
                },
                enumerable: true
            });
            function checkAndConvert(value) {
                if (!utils.checks.notEmpty(value)) {
                    return null;
                }
                if (utils.checks.isString(value)) {
                    return value;
                }
                return utils.converters.toInt(value);
            }
        }
        SectorParams.prototype.url = function sectorParamsUrl(urlFormat, paramType) {
            var url = IdsParams.prototype.url.call(this, urlFormat, paramType);
            url = utils.format(url, this.continent, this.floor, this.region, this.map);
            return url;
        };
        SectorParams.prototype.getQueryString = MapParams.prototype.getQueryString;
        function PoiParams() {
            SectorParams.apply(this, arguments);
            this.type = "PoiParams";
        }
        PoiParams.prototype.url = SectorParams.prototype.url;
        PoiParams.prototype.getQueryString = SectorParams.prototype.getQueryString;
        function TaskParams() {
            SectorParams.apply(this, arguments);
            this.type = "TaskParams";
        }
        TaskParams.prototype.url = SectorParams.prototype.url;
        TaskParams.prototype.getQueryString = SectorParams.prototype.getQueryString;
        function RecipeSearchParams() {
            var output, input;
            CommonParams.apply(this, arguments);
            this.type = "RecipeSearchParams";
            Object.defineProperty(this, "output", {
                get: function() {
                    return output;
                },
                set: function(value) {
                    output = setOutput(value);
                },
                enumerable: true
            });
            Object.defineProperty(this, "input", {
                get: function() {
                    return input;
                },
                set: function(value) {
                    input = setInput(value);
                },
                enumerable: true
            });
            function setOutput(value) {
                if (value && value !== 0) {
                    input = null;
                }
                return checkAndConvert(value);
            }
            function setInput(value) {
                if (value && value !== 0) {
                    output = null;
                }
                return checkAndConvert(value);
            }
            function checkAndConvert(value) {
                if (!utils.checks.notEmpty(value)) {
                    return null;
                }
                if (utils.checks.isString(value)) {
                    return value;
                }
                return utils.converters.toInt(value);
            }
        }
        RecipeSearchParams.prototype.url = CommonParams.prototype.url;
        RecipeSearchParams.prototype.getQueryString = function getQueryStringRecipeSearch() {
            var params = [], pQueryString = CommonParams.prototype.getQueryString.call(this);
            if (pQueryString) {
                params.push(pQueryString);
            }
            if (this.input) {
                params.push("input=" + this.input);
            } else if (this.output) {
                params.push("output=" + this.output);
            }
            return params.join("&");
        };
    })();
    function Endpoint(key, location, isAuthenticated, paramType) {
        "use strict";
        var urlFormat = gw2Api.config.createUrl(location);
        this.key = key;
        this.urlFormat = urlFormat;
        this.isAuthenticated = isAuthenticated;
        this.paramType = paramType;
        this.get = getFactory();
        this.getParameters = parameters;
        this.url = urlFactory();
        function getFactory() {
            if (isAuthenticated) {
                return getAuthenticated;
            }
            return get;
        }
        function get(params) {
            var url = urlFactory()(params);
            return ajax.get(url);
        }
        function getAuthenticated(params) {
            var url;
            if (!params.token) {
                throw new Error("token must be set on params when calling an authenticated endpoint");
            }
            url = urlFactory()(params);
            return ajax.get(url);
        }
        function urlFactory() {
            if (isAuthenticated) {
                return formUrlAuthenticated;
            }
            return formUrl;
        }
        function formUrl(params) {
            return params.url(urlFormat, paramType);
        }
        function formUrlAuthenticated(params) {
            var url = formUrl(params);
            if (params.token) {
                url = appendAuthentication(url, params.token);
            }
            return url;
        }
        function appendAuthentication(url, token) {
            var tokenQs = "access_token=" + token;
            if (url.indexOf("?") >= 0) {
                return url + "&" + tokenQs;
            }
            return url + "?" + tokenQs;
        }
        function parameters() {
            if (this.paramType) {
                return new gw2Api.params[paramType]();
            }
            return {};
        }
    }
    (function() {
        "use strict";
        var eps = {}, keys = [];
        initEndpoints();
        gw2Api.endpoints = eps;
        gw2Api.endpointKeys = keys;
        function addEndpoint(endpoint) {
            utils.splitIdentifier(endpoint.key, endpoint, eps);
            keys.push(endpoint.key);
        }
        function initEndpoints() {
            addEndpoint(new Endpoint("account.url", "account", true, "AuthParams"));
            addEndpoint(new Endpoint("account.bank.url", "account/bank", true, "AuthParams"));
            addEndpoint(new Endpoint("account.dyes.url", "account/dyes", true, "AuthParams"));
            addEndpoint(new Endpoint("account.materials.url", "account/materials", true, "AuthParams"));
            addEndpoint(new Endpoint("account.skins.url", "account/skins", true, "AuthParams"));
            addEndpoint(new Endpoint("account.wallet.url", "account/wallet", true, "AuthParams"));
            addEndpoint(new Endpoint("build.url", "build", false, "CommonParams"));
            addEndpoint(new Endpoint("characters.url", "characters", true, "IdsAuthParams"));
            addEndpoint(new Endpoint("characters.inventory.url", "characters/{0}/inventory", true, "CharacterParams"));
            addEndpoint(new Endpoint("characters.equipment.url", "characters/{0}/equipment", true, "CharacterParams"));
            addEndpoint(new Endpoint("colors.url", "colors", false, "IdsParams"));
            addEndpoint(new Endpoint("commerce.exchange.url", "commerce/exchange", false, "CommonParams"));
            addEndpoint(new Endpoint("commerce.exchange.coins.url", "commerce/exchange/coins", false, "QuantityParams"));
            addEndpoint(new Endpoint("commerce.exchange.gems.url", "commerce/exchange/gems", false, "QuantityParams"));
            addEndpoint(new Endpoint("commerce.listings.url", "commerce/listings", false, "IdsParams"));
            addEndpoint(new Endpoint("commerce.prices.url", "commerce/prices", false, "IdsParams"));
            addEndpoint(new Endpoint("commerce.transactions.url", "commerce/transactions", true, "AuthParams"));
            addEndpoint(new Endpoint("commerce.transactions.current.url", "commerce/transactions/current", true, "AuthParams"));
            addEndpoint(new Endpoint("commerce.transactions.current.buy.url", "commerce/transactions/current/buy", true, "AuthParams"));
            addEndpoint(new Endpoint("commerce.transactions.current.sell.url", "commerce/transactions/current/sell", true, "AuthParams"));
            addEndpoint(new Endpoint("commerce.transactions.history.url", "commerce/transactions/history", true, "AuthParams"));
            addEndpoint(new Endpoint("commerce.transactions.history.buy.url", "commerce/transactions/history/buy", true, "AuthParams"));
            addEndpoint(new Endpoint("commerce.transactions.history.sell.url", "commerce/transactions/history/sell", true, "AuthParams"));
            addEndpoint(new Endpoint("currencies.url", "currencies", false, "IdsParams"));
            addEndpoint(new Endpoint("continents.url", "continents", false, "IdsParams"));
            addEndpoint(new Endpoint("floors.url", "continents/{0}/floors", false, "FloorParams"));
            addEndpoint(new Endpoint("regions.url", "continents/{0}/floors/{1}/regions", false, "RegionParams"));
            addEndpoint(new Endpoint("maps.url", "continents/{0}/floors/{1}/regions/{2}/maps", false, "MapParams"));
            addEndpoint(new Endpoint("sectors.url", "continents/{0}/floors/{1}/regions/{2}/maps/{3}/sectors", false, "SectorParams"));
            addEndpoint(new Endpoint("pois.url", "continents/{0}/floors/{1}/regions/{2}/maps/{3}/pois", false, "PoiParams"));
            addEndpoint(new Endpoint("pvp.games.url", "pvp/games", true, "AuthParams"));
            addEndpoint(new Endpoint("pvp.stats.url", "pvp/stats", true, "AuthParams"));
            addEndpoint(new Endpoint("tasks.url", "continents/{0}/floors/{1}/regions/{2}/maps/{3}/tasks", false, "TaskParams"));
            addEndpoint(new Endpoint("files.url", "files", false, "IdsParams"));
            addEndpoint(new Endpoint("items.url", "items", false, "IdsParams"));
            addEndpoint(new Endpoint("materials.url", "materials", false, "IdsParams"));
            addEndpoint(new Endpoint("quaggans.url", "quaggans", false, "IdsParams"));
            addEndpoint(new Endpoint("recipes.url", "recipes", false, "IdsParams"));
            addEndpoint(new Endpoint("recipes.search.url", "recipes/search", false, "RecipeSearchParams"));
            addEndpoint(new Endpoint("specializations.url", "specializations", false, "IdsParams"));
            addEndpoint(new Endpoint("traits.url", "traits", false, "IdsParams"));
            addEndpoint(new Endpoint("skins.url", "skins", false, "IdsParams"));
            addEndpoint(new Endpoint("tokenInfo.url", "tokeninfo", true, "AuthParams"));
            addEndpoint(new Endpoint("worlds.url", "worlds", false, "IdsParams"));
        }
    })();
    return gw2Api;
});