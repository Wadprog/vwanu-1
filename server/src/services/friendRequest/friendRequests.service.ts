// Initializes the `users` service on path `/users`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { FriendRequest } from './friendRequests.class';
import hooks from './friendRequests.hook';

// Add this service to the service type index
declare module '../../declarations' {
  // eslint-disable-next-line no-unused-vars
  interface ServiceTypes {
    friendRequest: FriendRequest & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const sequelize = app.get('sequelizeClient');
  const options = {
    Model: sequelize.models.FriendRequests,
    paginate: app.get('paginate'),
    multi: ['remove','patch'],
  };

  app.use('/friendRequest', new FriendRequest(options, app));
  const service = app.service('friendRequest');
  service.hooks(hooks);
}
