function appendMutation (options) {
  return (builder) => {
    const handler = options.handler

    builder.hook('field',
      (field, {}, {
         scope: {
           isRootMutation,
           fieldName
         }
       }) => {
        if (!isRootMutation || fieldName !== options.mutationName || !field.resolve || field.resolve.wrapped) {
          return field;
        }

        const oldResolve = field.resolve

        const resolve = async function resolve(...args)
        {
          const result = await
          oldResolve.apply(this, args)
          const finalResult = await handler(args, result)
          return finalResult === undefined ? result : finalResult
        }
        resolve.wrapped = true

        return Object.assign(field, {resolve});
      });
  }
}

module.exports = appendMutation