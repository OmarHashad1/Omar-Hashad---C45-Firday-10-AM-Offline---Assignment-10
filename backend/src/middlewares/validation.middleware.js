const dataSources = ["body", "params", "query"];
export const validate = (schema) => {
  return (req, res, next) => {
    console.log(1);
    let validationErrors = [];
    dataSources.forEach((source) => {
      if (!schema[source]) return;
      const payload = schema[source].validate(req[source], {
        abortEarly: false,
        convert: false,
      });
      if (payload.error)
        validationErrors.push({
          [source]: payload.error.details.map((err) => err.message),
        });
    });

    console.log(2);
    if (validationErrors.length) {
      console.log(3);
      res
        .status(423)
        .json({ message: "validation failed", data: { ...validationErrors } });
    }

    next();
  };
};
