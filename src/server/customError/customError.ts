class CustomError extends Error {
  constructor(
    message?: string,
    public state?: number,
    public customMessage?: string
  ) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export default CustomError;
