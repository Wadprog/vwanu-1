import { Application } from '../declarations';
/** Local dependencies */
import post from './posts/posts.service';
import users from './users/users.service';
import search from './search/search.service';
import mailer from './mailer/mailer.service';
import friend from './friends/friends.service';
import comments from './comments/comments.service';
import followers from './followers/followers.service';
import userVisitors from './userVisitors/user-visitors.service';
import friendRequest from './friendRequest/friendRequests.service';
import refreshTokens from './refresh-tokens/refresh-tokens.service';
import emailTemplate from './email-template/email-template.service';
import undesiredFriend from './undesiredFriends/undesiredFriends.service';
import authmanagementService from './authmanagement/authmanagement.service';

import timeline from './timeline/timeline.service';

import groups from './groups/groups.service';

import blogs from './blogs/blogs.service';

import timelineBlogs from './timeline-blogs/timeline-blogs.service';

import pages from './pages/pages.service';

export default function (app: Application): void {
  app.configure(search);
  app.configure(post);
  app.configure(users);
  app.configure(friend);
  app.configure(mailer);
  app.configure(timeline);
  app.configure(comments);
  app.configure(followers);
  app.configure(refreshTokens);
  app.configure(emailTemplate);
  app.configure(userVisitors);
  app.configure(friendRequest);
  app.configure(undesiredFriend);
  app.configure(authmanagementService);
  app.configure(groups);
  app.configure(blogs);
  app.configure(timelineBlogs);
  app.configure(pages);
}
