/* eslint-disable no-param-reassign */
/* eslint-disable import/no-import-module-exports */

import { Id } from '@feathersjs/feathers';
import { Model } from 'sequelize';

export interface FriendInterface {
  user_one_id: Id;
  user_two_id: Id;
}
export default (sequelize: any, DataTypes: any) => {
  class Friend extends Model<FriendInterface> implements FriendInterface {
    user_one_id: Id;
    user_two_id: Id;
  }
  Friend.init(
    {

      user_one_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      user_two_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },

    },

    {
      sequelize,
      modelName: 'Friend',
      tableName: 'friends',
      underscored: true,
      updatedAt: false,
    }
  );
  return Friend;
};
