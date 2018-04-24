const { objection, Model } = require('objection');

class User extends Model {
  static get tableName() {
    return 'users';
  }

  $beforeValidate() {
    if (this.id) {
      throw new objection.ValidationError({
        message: 'identifier should not be defined before insert',
        type: 'MyCustomError',
      });
    }
  }

  $afterValidate() {
    // Custom validation
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['firstName', 'lastName', 'email', 'password', 'phoneNumber'],

      properties: {
        id: { type: 'integer' },
        firstName: { type: 'string', minLength: 1, maxLength: 255 },
        lastName: { type: 'string', minLength: 1, maxLength: 255 },
        email: { type: 'string' },
        password: { type: 'string' },
        phoneNumber: { type: 'string' },
      },
    };
  }
}

module.exports = User;
