function responseHeader(pSize, pTotal, rCount, rTotal){
  'use strict';
  var xPageSize, xPageTotal, xResultCount, xResultTotal;
  xPageSize = pSize;
  xPageTotal = pTotal;
  xResultCount = rCount;
  xResultTotal = rTotal;
  return{
    get pageSize(){return xPageSize;},
    get pageTotal(){return xPageTotal;},
    get resultCount(){return xResultCount;},
    get resultTotal(){return xResultTotal;}
  };
}