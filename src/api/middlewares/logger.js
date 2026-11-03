const logger = (req, res, next) => {
  console.log("Middleware ran");
  next();
}

export default logger;
