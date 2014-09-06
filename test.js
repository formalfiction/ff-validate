var validate = require('./index');

var obj = {
	one : "alpha        ",
	two : "five",
	three : [
		"a", "b", "c"
	],
}

new validate(obj)
	.attr('one', ['string'])
	.attr('two', 'number')
	.done(function(attrs, errors, numErrors){
		console.log(attrs);
		console.log(errors);
		console.log(numErrors);
		process.exit();
	});