// import { HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';

/** Local dependencies */
import IncludeAssociations from '../../Hooks/IncludeAssociations';
import addAssociation from '../../Hooks/AddAssociations';

const { authenticate } = authentication.hooks;

const onlyPublic = (context) => {
  const { params } = context;
  const { query } = params;
  query.PostId = null;
  query.privacyType = 'public';
  return context;
};

const UserAttributes = [
  'firstName',
  'lastName',
  'id',
  'profilePicture',
  'createdAt',
];
export default {
  before: {
    all: [
      authenticate('jwt'),
      IncludeAssociations({
        include: [
          {
            model: 'posts',
            as: 'Comments',
            attributes: ['id', 'postText', 'PostId', 'updatedAt', 'createdAt'],
            include: [
              {
                model: 'posts',
                as: 'User',
                attributes: UserAttributes,
              },
            ],
          },
          {
            model: 'posts',
            as: 'Media',
          },
        ],
      }),
      addAssociation({
        models: [
          {
            model: 'reactions',
          },

          {
            model: 'users',
            attributes: UserAttributes,
          },
        ],
      }),
    ],
    find: [onlyPublic],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
