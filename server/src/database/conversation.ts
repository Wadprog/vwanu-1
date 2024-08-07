/* eslint-disable no-param-reassign */
import { Model } from 'sequelize';
import { Id } from '@feathersjs/feathers';

export interface ConversationInterface {
  id: Id;
  amountOfPeople: number;
  amountOfMessages: number;
  amountOfUnreadMessages: number;
  type: string;
  name: string;
}
export default (sequelize: any, DataTypes: any) => {
  class Conversation
    extends Model<ConversationInterface>
    implements ConversationInterface {
    id: Id;

    amountOfPeople: number;

    amountOfMessages: number;

    amountOfUnreadMessages: number;

    type: string;

    name: string;

    static associate(models: any): void {
      Conversation.belongsToMany(models.User, {
        through: 'ConversationUsers',
      });
      Conversation.hasMany(models.Message);
    }
  }
  Conversation.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },

      amountOfPeople: { type: DataTypes.INTEGER, defaultValue: 0 },
      type: {
        type: DataTypes.STRING,
        defaultValue: 'direct',
        allowNull: false,
        validate: {
          customValidator: (value) => {
            if (!['group', 'direct'].includes(value)) {
              throw new Error(
                `${value} is not a valid option for friendPrivacy`
              );
            }
          },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      amountOfMessages: { type: DataTypes.INTEGER, defaultValue: 0 },
      amountOfUnreadMessages: { type: DataTypes.INTEGER, defaultValue: 0 },
    },

    {
      hooks: {},
      sequelize,
      modelName: 'Conversation',
      tableName: 'conversations',
      underscored: true,
    }
  );
  return Conversation;
};
