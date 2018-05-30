/**
 * Message model for messages
 * Each message container:
 *  id (primary)
 *  content
 *  author (foreign key)
 *  chatroom (foreign key)
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
