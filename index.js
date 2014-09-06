/*
 * Just a bunch of basic functions for validating.
 * *Usage:*
 validate(attributesObject)
 	.attr('attrName','validatorType')
 	.attr('attrName',function(attr, errors){
 		errors.push('example error');
		return
 	})
 	.attr('attrName',['validatorType','secondValidatorType'], function(attr){
 		// conform the attribute
 		return attr * 10;
 	})
 	.done(function(conformedAttrs, errs, numErrs){
	
 	})
 	.error(function(errs, numErrors){

 	})
*/

var isArray = Array.isArray || function (obj) {
	return (Object.prototype.toString.call(obj) === "[object Array]");
}

var isAlphaNumeric = function (obj) {
	return alphaNumeric.test(obj);
}

var validators = {
	exists : function (input, errs) {
		if (!input) {
			errs.push("required");
		}
		return
	},
	number : function (input, errs) {
		if (isNaN(+input)) {
			errs.push("must be a Number");
		}
		return
	},
	array : function (input, errs) {
		if (!isArray(input)) {
			errs.push("must be an array");
		}
		return;
	},
	string : function (input, errrs) {
		if (typeof input !== "string") {
			errs.push("must be a string");
		}
	},
	email : function (input, errs) {
		if (!input.match(emailRe)) {
			errs.push("Invalid Email");
		}
		return
	},
	alphaNumeric : function (input, errs) {
		if (!isAlphaNumeric(input)) {
			errs.push("Can only Contain letters, numbers, and '_' ");
		}
	},
	phoneNumber : function (input, errs) {

		return
	},
	date : function (input, errs) {

		return
	},
	url : function (input, errs) {

		return
	},
	username : function (input, errs) {
		if (input.length < 3) {
			errs.push("username must be at least 3 characters");
		} else if (input.length > 25) {
			errs.push("username must be less than 25 characters");
		}
		return
	},
	password : function (input, errs) {
		return
	},
	zipOrPostalCode : function (input, errs) {
		return
	},
	country : function (input, errs) {
		return
	},
	city : function (input, errs) {
		return
	},
	stateOrProvince : function (input, errs) {
		return
	}
}

var conformers = {
	default : function (attr) {
		if (typeof attr === "string") {
			attr = attr.trim();
		} else if (!isNaN(+attr)) {
			attr = +attr;
		}
		return attr;
	}
};

function validate (attrs) {
	this._attrs = attrs || {};
	this._errors = {};
	this._numErrors = 0;

	// console.log(this);

	return this;
}

validate.prototype.conform = function (attr, validator) {
	if (typeof validators != "string") {
		validator = 'default'
	} else if (!conformers[validator]) {
		validator = 'default';
	}

	if (typeof conformers[validator] === "function") {
		attr = conformers[validator](attr);
	}

	return attr;
}

validate.prototype.attr = function (attr, validator, conformer, errors) {
	var self = this, attrName;
	errors || (errors = [])

	if (typeof attr === "string" && this._attrs[attr]) {
		attrName = attr;
		attr = this._attrs[attr];
	} else {
		attrName = "form";
	}

	if (typeof conformer === "function") {
		attr = conformer(attr);
	}

	// run through conformer
	attr = this.conform(attr, validator);

	// run through validator(s)
	if (isArray(validator)) {
		// if it's an array, recurse with each successive values
		validator.forEach(function(v){
			self.attr.call(self, attrName, v, null, errors);
		});
	} else if (typeof validator === "string") {
		if (validators[validator]) {
			validators[validator](attr, errors);
		} else {
			console.warn('unknown validator: ' + validator);
		}
	} else if (typeof validator === "function") {
		validator(attr, errors);
	}

	// set errors, combining if already present (due to recursion)
	if (errors.length) {
		if (this._errors[attrName]) {
			this.errors[attrName] = this.errors.attrName.concat(errors);
		} else {
			this._errors[attrName] = errors;
			this._numErrors++;
		}
	}

	// set the conformed value to the interal attributes object.
	this._attrs[attrName] = attr;

	return this;
}

validate.prototype.done = function (callback) {
	callback(this._attrs, this._errors, this._numErrors);
	return this;
}

module.exports = validate;

// Down here b/c some of these regexps break my syntax highlighter :(
var emailRe = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gi
	, alphaNumeric = /^[a-zA-Z0-9_]+$/i
