var ajax;
(function(){
  'use strict';
  ajax = {
    get: get
  };
function get(url, headers){
  var oReq = createRequest(url, headers);
  if (gw2Api.config.withCredentials) {
    oReq.withCredentials = true;
  }
  return setPromise(oReq);
}

function createRequest(url, headers){
  var oReq = new XMLHttpRequest(),
      headerArray = headers;
  oReq.open('GET', url, true);
  if(headers){
    if(!gw2Api.utils.checks.isArray(headers)){
      headerArray = [headers];
    }
    setHeaders(oReq, headerArray);
  }
  oReq.responseType = 'json';
  return oReq;
}

function setHeaders(req, headerArray){
  var i, header;
  for(i = 0; i < headerArray.length; i++){
    header = headerArray[i];
    for(var prop in header){
      if(header.hasOwnProperty(prop)){
        req.setRequestHeader(prop, header[prop]);
      }
    }
  }
}
//basic working of setPromise and headers from q-xhr
function setPromise(xhr){
  var deferred = Q.defer(),
        promise = deferred.promise,
        status,
        aborted = -1,
        timeoutId;
  xhr.onreadystatechange = function() {
    var response,
        responseHeaders,
        rawHeaders,
        gwHeaders,
        promiseResult;
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

  xhr.onprogress = function (progress) {
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
    return (str || '').toLowerCase();
  }
  //page size and page total only look to
  //get set if a page parameter is passed
  //in the query string
  function createGwHeaders(rawHeaders){
    var xPageSize, xPageTotal, xResultCount, xResultTotal;
    xPageSize = rawHeaders['x-page-size'];
    xPageTotal = rawHeaders['x-page-total'];
    xResultCount = rawHeaders['x-result-count'];
    xResultTotal = rawHeaders['x-result-total'];

    return responseHeader(xPageSize, xPageTotal, xResultCount, xResultTotal);
  }
  function parseHeaders(headers) {
    var parsed = {}, key, val, i;

    if (!headers) {return parsed;}

    headers.split('\n').forEach(function(line) {
      i = line.indexOf(':');
      key = lowercase(line.substr(0, i).trim());
      val = line.substr(i + 1).trim();

      if (key) {
        if (parsed[key]) {
          parsed[key] += ', ' + val;
        } else {
          parsed[key] = val;
        }
      }
    });

    return parsed;
  }

  function headersGetter(headers) {
    var headersObj = typeof headers === 'object' ? headers : undefined;

    return function(name) {
      if (!headersObj) {headersObj = parseHeaders(headers);}

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
}());
