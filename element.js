function type(obj) {
	return obj.__proto__.constructor
}

var ELEMENTS = []
var svg = "";

function RENDER(code=svg) {
	if (code === "") {
		for (var i = 0; i < ELEMENTS.length; i++) {
			code += ELEMENTS[i].svg()
		}
	}
	$('svg').html(code)
	for (var i = 0; i < ELEMENTS.length; i++) {
		ELEMENTS[i].connect()
	}
}

class Point {
	constructor(x, y) {
		this.x = x
		this.y = y
	}
	seq() {
		return `${this.x},${this.y} `
	}
	plus(vector) {
		return new Vector(this.x + vector.x, this.y + vector.y)
	}
	shift(dx=0, dy=0) {
		this.x += dx
		this.y += dy
	}
	rotate(about, degrees) {
		var dx = this.x - about.x
		var dy = this.y - about.y
		var sin = Math.sin(degrees * Math.PI / 180)
		var cos = Math.cos(degrees * Math.PI / 180)
		this.x = (dx * cos) - (dy * sin) + about.x
		this.y = (dy * cos) + (dx * sin) + about.y
		return this
	}
	// mark(size=10, style={}) {
	// 	var n = new Point(this.x, this.y-size)
	// 	var s = new Point(this.x, this.y+size)
	// 	var e = new Point(this.x-size, this.y)
	// 	var w = new Point(this.x+size, this.y)
	// 	var svg = svg
	// 	new Line(n,s,style)
	// 	new Line(e,w,style)
	// }
}

class Vector extends Point {
	times(coef) {
		return new Vector(this.x * coef, this.y * coef)
	}
}

class Origin extends Point {
	constructor(x, y) {
		super()
		this.x = x * K + origin.x
		this.y = y * K + origin.y
	}	
}

function DatePointConvert(date) {
	return (date.valueOf() - MIN_DATE.valueOf()) / MS_PIXEL
}
class DatePoint extends Point {
	constructor(date, y) {
		super(DatePointConvert(date),y)
	}
}
DatePoint.convert = DatePointConvert


function pointSVGP(points) {
	var result = ''
	for (var i = 0; i < points.length; i++) {
		result += points[i].seq()
	}
	return result
}

function kwargSVGP(obj, isStyle=false) {
	if (type(obj) == String) {
		return obj
	}
	var result = ''
	for (var key in obj) {
		var val = obj[key]
		if (key == 'points') {
			val = pointSVGP(val)
		}
		if (key == 'style') {
			val = kwargSVGP(val, true)
		}
		result += isStyle ? `${key}:${val}; ` : `${key}="${val}" `
	}
	return result
}

class Element {
	constructor(name, options={}, content='') {
		this.name = name
		this.options = options
		this.content = content
		if ('title' in options) {
			this.content += `<title>${options['title']}</title>`
		}
		this.eid = ELEMENTS.length
		ELEMENTS.push(this)
	}
	svg() {
		return `<${this.name.toLowerCase()} ${kwargSVGP(this.options)}>${this.content}</${this.name.toLowerCase()}>\n`
	}
	connect() {
		this.element = $('#eid'+this.eid)
	}
	render() {
		// this.element = document.createElement(this.name.toUpperCase())
		// board.appendChild(this.element)
		this.options['id'] = 'eid'+this.eid
		svg += this.svg()
		// RENDER()
	}
}

class Line extends Element {
	constructor(point1, point2, style={}) {
		super('line',{
			'x1':point1.x,
			'y1':point1.y,
			'x2':point2.x,
			'y2':point2.y,
			'style':style,
		})
	}
}

class VerticalLine extends Line {
	constructor(x, y1, y2, style={}) {
		super(
			new Point(x, y1),
			new Point(x, y2),
			style
		)
	}
}

class Text extends Element {
	constructor(content, position, options={}) {
		var ox = options.ox === undefined ? -10 : options.ox
		var oy = options.oy === undefined ?   5 : options.oy
		options.x = position.x + ox
		options.y = position.y + oy
		options.ox = undefined
		options.oy = undefined
		super('text',options,content)
	}
}

class Polygon extends Element {
	constructor(points, options={}, content='') {
		options.points = points
		super('polygon', options, content)
		this.options = options
	}
	render() {
		svg += this.svg()
		// RENDER()
	}
}

class Rectangle extends Polygon {
	constructor(x1, x2, y1, y2, options={}) {
		if (type(x1) == Array) {
			var lef = x1[0]
			var rig = x1[1]
			var bot = x1[2]
			var top = x1[3]
			options = x2
		} else {
			var lef = x1
			var rig = x2
			var bot = y1
			var top = y2
		}
		super([
			new Point(lef,bot),
			new Point(lef,top),
			new Point(rig,top),
			new Point(rig,bot)
		],options)
	}
}

class Image extends Element {
	constructor(src, ulcx, ulcy, width, height, options={}) {
		options['href']   = src
		options['x']      = ulcx
		options['y']      = ulcy
		options['width']  = width  + "px"
		options['height'] = height + "px"
		super('image',options)
	}
}