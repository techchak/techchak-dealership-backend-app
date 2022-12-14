const ErrorResponse = require('../utils/errorResponse.util');

const errorHandler = (err, req, res, next) => {

	let error = { ...err };
	error.message = err.message;

	console.log("the error", err); // log the error to get what to test for
	let ea = [];

	// ...
	if(err.errors !== undefined){

		ea = Object.values(err.errors).map((item) => {
			let m = '';
			if(item.properties){
				m = item.properties.message;
			}else{
				m = item;
			}
			return m;
		});

	}

	// Mongoose bad objectID
	if (err.name === 'CastError') {
		const message = `Resource not found`;
		error = new ErrorResponse(message, 404, ea);
	}

	// Mongoose duplicate key
	if (err.code === 11000) {
		const message = `Duplicate field value entered`;
		error = new ErrorResponse(message, 400, ea);
	}

	// Mongoose validation error
	if (err.name === 'ValidationError') {

		const message = "An error occured";
		error = new ErrorResponse(message, 400, ea);
	}

	// Mongoose reference error
	if (err.name === 'ReferenceError') {
		const message = "Something is not right";
		error = new ErrorResponse(message, 400, ea);
	}

	// format messages
	// let formatted = '';
	// if(error.message,strIncludes('Error:')){
	// 	formatted = "Invalid token";
	// }else{
	// 	formatted = error.message;
	// }

	res.status(error.statusCode || 500).json({
		error: true,
		errors: error.errors ? error.errors : [],
		data: null,
		message: error.message || `Server Error`,
		status: error.statusCode ? error.statusCode : 500
	});
};

module.exports = errorHandler;
