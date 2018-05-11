module.exports = {
  errResponse: (errMessage, errStatus) => {
    const err = new Error(errMessage);
    err.status = errStatus;
    return err;
  }
};
