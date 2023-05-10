import Logger from '../logger';
import { IMessenger } from '../../../schema/email.schema';

export default class Notifier {
  private messenger;

  constructor(messenger: IMessenger) {
    this.messenger = messenger;
  }

  send = async (to: string, html: string, subject: string) => {
    this.messenger.send(to, html, subject).catch((err) => {
      Logger.error(err);
      console.log(err);
    });
  };
}
