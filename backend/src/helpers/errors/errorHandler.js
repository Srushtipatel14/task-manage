class ErrorHandler extends Error {
    constructor(message, statusCode, errorDetails = null) {
        super(message);

        this.statusCode = statusCode;
        if (errorDetails instanceof Error) {
            this.error = {
                name: errorDetails.name,
                message: errorDetails.message,
            };
        } else {
            this.error = errorDetails || { message };
        }
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ErrorHandler;