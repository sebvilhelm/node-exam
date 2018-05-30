/**
 * Message model for messages
 * Each message container:
 *  id (primary)
 *  content
 *  authorId (foreign key)
 *  chatroomId (foreign key)
 */

/**
 * * Select only the n most recent
 * model.findOne({
 *  limit: n,
 *  where: {
 *    ...
 *  },
 *  order: [ [ 'createdAt', 'DESC' ]],
 * });
 *
 */
