var Vector2 = function () {
  this._x = 0;
  this._y = 0;
};

Vector2.prototype.initialize = function (x, y) {
  _x = x;
  _y = y;
};

Vector2.prototype.x = function () {
  return _x;
};

Vector2.prototype.setX = function (x) {
  _x = x;
};

Vector2.prototype.y = function () {
  return _y;
};

Vector2.prototype.setY = function (y) {
  _y = y;
};
