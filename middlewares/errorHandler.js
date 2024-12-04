const handleCastError = (err) => ({
    statusCode: 400,
    message: `Invalid ${err.path}: ${err.value}.`,
  });
  
  const handleDuplicateKeyError = (err) => {
    const key = Object.keys(err.keyValue)[0];
    const fieldName = key.charAt(0).toUpperCase() + key.slice(1);
    return {
      statusCode: 400,
      message: `${fieldName} already exists. Please use a different value.`,

    };
  };
  
  const handleValidationError = (err) => {
    const errors = Object.values(err.errors).map((e) => e.message);
    return {
      statusCode: 400,
      message: `${errors.join(', ')}`,
    };
  };
  
  const handleGenericError = (err) => ({
    statusCode: 500,
    message: err.message || 'An unknown error occurred.',
  });
  
  const errorMiddleware = (err, req, res, next) => {
    let responseError;
  
    // Handle specific Mongoose errors
    if (err.name === 'CastError') {
      responseError = handleCastError(err);
    } else if (err.code === 11000) {
      responseError = handleDuplicateKeyError(err);
    } else if (err.name === 'ValidationError') {
      responseError = handleValidationError(err);
    } else {
      responseError = handleGenericError(err); // Fallback for other errors
    }
  
    // Send the error response
    res.status(responseError.statusCode).json({
      success: false,
      message: responseError.message,
    });
  };
  
  module.exports = errorMiddleware;
  