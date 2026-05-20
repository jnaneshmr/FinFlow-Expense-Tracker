const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (err.name === 'ZodError')
    return res.status(400).json({ error: 'Validation error', details: err.errors });
  if (err.code === 'P2002')
    return res.status(409).json({ error: 'A record with this value already exists' });
  if (err.code === 'P2025')
    return res.status(404).json({ error: 'Record not found' });
  res.status(err.statusCode || 500).json({ error: err.message || 'Internal server error' });
};

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = { errorHandler, asyncHandler };
