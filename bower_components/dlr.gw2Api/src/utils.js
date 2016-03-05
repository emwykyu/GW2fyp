var utils;
(function(){
  'use strict';
utils = {
  converters: converters(),
  checks: checks(),
  format: strFormat,
  splitIdentifier: splitIdentifier
};
function splitIdentifier(name, endpoint, eps){
  var nameArray, index, leaf, lastNodeIndex, node, part;
  nameArray = name.split('.');
  lastNodeIndex = nameArray.length - 1;
  leaf = nameArray[lastNodeIndex];
  node = eps;
  //handle nested objects
  for(index = 0; index < lastNodeIndex; index ++){
    part = nameArray[index];
    if(node[part]){
      node = node[part];
      continue;
    }
    node[part] = {};
    node = node[part];
  }
  //handle leaf and create property
  node[nameArray[lastNodeIndex]] = endpoint;
}
function strFormat(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] !== 'undefined' ? args[number] : match;
    });
  }
function converters(){
  return {
    toInt: toInt
  };
}
function checks(){
  return {
    notEmpty: notEmpty,
    isNumber: isNumber,
    isArray: Array.isArray,
    isString: isString
  };
}
function notEmpty(value){
  var trimmed;
  if(!value && value !== 0){
    return false;
  }
  trimmed = value.toString().trim;
  return !!trimmed;
}
function isString(value) {return typeof value === 'string';}
function isNumber(value) {return typeof value === 'number';}
function toInt(num){
  var asInt, isInt;
  isInt = num.toString().match(/^-?\d+$/gm);
  if(!isInt){
    throw new Error('value must be a number');
  }
  asInt = parseInt(num, 10);
  if(isNaN(asInt) || !isNumber(asInt)){
    throw new Error('value must be a number');
  }
  return asInt;
}
}());
