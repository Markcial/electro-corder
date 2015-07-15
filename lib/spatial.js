export class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  compare(point) {
    return point.x > this.x && point.y > this.y; 
  }
}

export class Vector {
  constructor(pointA, pointB) {
    this.pointA = pointA;
    this.pointB = pointB;
  }
}

export class Line {
  constructor(pointA, pointB) {
    this.pointA = pointA;
    this.pointB = pointB;
  }
}

export class Circle {
  // pointA is the center, pointB is the radius that draws the arc
  constructor(pointA, pointB) {
    this.pointA = pointA;
    this.pointB = pointB;
  }
}

export class Rectangle {
  constructor(pointA, pointB) {
    this.pointA = pointA;
    this.pointB = pointB;
  }
}

export class Polygon {
  constructor(...points) {
    this.points = points;
  }
}
