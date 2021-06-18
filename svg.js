// const Jul =  6;
// const Aug =  7;

// const MIN_DATE = new FlexDate(1971,Jul,26)
// const MAX_DATE = new FlexDate(1971,Aug, 6)

// const YEAR_LINES = false

// var width = window.innerWidth - 120
// // var width = 1000000
// const MS_PIXEL = (MAX_DATE.valueOf() - MIN_DATE.valueOf()) / width

// const HEIGHT = 100
// const GUTTER =  30

// for (var datenum = MIN_DATE.valueOf(); datenum <= MAX_DATE.valueOf(); datenum += DAY) {
// 	linedate = new Date(datenum)
// 	lineX = DatePoint.convert(linedate)
// 	new VerticalLine(lineX,0,HEIGHT-20,{'stroke':'gray','stroke-width':0.5})
// 	new Text(String(linedate).substring(4,7)+' '+linedate.getDate(),new DatePoint(linedate, HEIGHT-10),{"fill":"gray"})
// }

function ms2(accel) {
	return accel * -9.2 + 374.5
}

function t(sec) {
	return sec * 0.4608 + 75.5
}

function updateSVG(now) {
	var sec = (now - tzero.valueOf()) / 1000
	// console.log(sec)
	new Image('https://history.nasa.gov/afj/ap15fj/pics/gforce.gif',0,0,455,410)
	new Line(new Point(0,ms2(9.7)), new Point(t(0),ms2(9.7)), {'stroke':'blue','stroke-width':2})
	new Line(new Point(t(694.67),ms2(0)), new Point(455,ms2(0)), {'stroke':'blue','stroke-width':2})
	new Line(new Point(t(sec),0), new Point(t(sec),410), {'stroke':'red'})
	for (var m = -2; m <= 15; m++) {
		new Line(new Point(t(m*60),ms2(0)),new Point(t(m*60),ms2(40)),{'stroke':'rgba(0,0,0,10%)'})
	}
	RENDER()
}


$(document).ready(function() {
	$('svg').width(455)
	$('svg').height(410)
	updateSVG(now)
})