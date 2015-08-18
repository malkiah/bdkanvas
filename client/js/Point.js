'use strict';

class Point
{
  constructor(x,y)
  {
    this.x = x;
    this.y = y;
  }

  serialize()
  {
    var result = {};
    result.x = this.x;
    result.y = this.y;
    return result;
  }
}
