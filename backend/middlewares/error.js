// //it has error class

class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

//middleware creation

export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  //mongodb compass or atlas error
  //when in connection take time that time it will give casterror

  //ex if i won't string but i will give number so it will give me casterror
  if (err.name === "CastError") {
    const message = `Invalid Resource not found: ${err.path}`;
    err = new ErrorHandler(message, 404);
  }
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default ErrorHandler;
