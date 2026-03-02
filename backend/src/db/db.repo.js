export const findOne = async ({ model, filter, select = {}, options = {} }) => {
  const query = await model.findOne(filter).select(select);
  if (options.lean) query.lean();
  if (options.populate) query.populate();

  const doc = await query;
  return doc;
};

export const findByEmail = async ({
  model,
  email,
  select = "",
  options = {},
}) => {
  const doc = await findOne({
    model: model,
    filter: { email },
    select,
    options,
  });

  return doc;
};

export const create = async ({ model, data, options = {} }) => {
  const user = await model.create(Array.isArray(data) ? data : [data], options);
  return Array.isArray(data) ? user : user[0];
};
