import { StatusCodes } from 'http-status-codes';

const postEndpoint = '/posts';
const endpoint = '/timeline';


describe("'timeline ' service", () => {

  it('registered the service', () => {
    const service = global.__APP__.service('timeline');
    expect(service).toBeTruthy();
  });

  it('Should receive 4 public posts', async () => {
    const [user] = await global.__getRandUsers(1);
    await Promise.all(
      Array.from({ length: 4 }).map(() =>
        global.__SERVER__
          .post(postEndpoint)
          .send({
            postText: `${user.firstName} is a cool person`,
            privacyType: 'public',
          })
          .set('authorization', user.accessToken)
      )
    );
    await global.__SERVER__
      .get(endpoint)
      .set('authorization', user.accessToken)
      .expect(StatusCodes.OK)
      .expect((res) => {
        expect(res.body.data).toHaveLength(4);
      });

  });

  it('should create a private post and not be pulled by unfriend User', async () => {

    await global.__SEQUELIZE__.models.Post.destroy({ where: {} });
    const [user, observer] = await global.__getRandUsers(2);

    await global.__SERVER__
      .post(postEndpoint)
      .send({
        postText: 'I am a private post',
        privacyType: 'private',
      })
      .set('authorization', user.accessToken)
      .expect(StatusCodes.CREATED);

    await global.__SERVER__
      .get(endpoint)
      .set('authorization', observer.accessToken)
      .expect(StatusCodes.OK)
      .expect((res) => {
        expect(res.body.data).toHaveLength(0);
      });

    await global.__SERVER__
      .get(endpoint)
      .set('authorization', user.accessToken)
      .expect(StatusCodes.OK)
      .expect((res) => {
        expect(res.body.data).toHaveLength(1);
      });

  });

});

/** **
 * 
 * 
 * 
 it('friend should still see 4 post as well', async () => {
    const { User_friends: friends } = app.get('sequelizeClient').models;
    aFriend = await createUser(testServer, getRandUser());
    aFriend = aFriend.body;
    await Promise.all([
      friends.create({
        UserId: aFriend.id,
        friendId: createdTestUser[0].body.id,
      }),
      friends.create({
        friendId: aFriend.id,
        UserId: createdTestUser[0].body.id,
      }),
    ]);

    const { body: timeline } = await testServer
      .get(endpoint)
      .set('authorization', aFriend.accessToken);

    expect(timeline.data).toHaveLength(4);
    expect(true).toBeTruthy();
  });

  it("should create a ' Friends type' post user see 6 observer 4 and friend 5", async () => {
    const friendsTypePost = await createPost(
      testServer,
      {
        postText: 'I am a friends type post',
        privacyType: 'friends',
      },
      createdTestUser[0].body.accessToken
    );
    expect(friendsTypePost.statusCode).toBe(201);

    const { body: observerTimeline } = await testServer
      .get(endpoint)
      .set('authorization', observer.accessToken);

    expect(observerTimeline.data).toHaveLength(4);

    const { body: aFriendTimeline } = await testServer
      .get(endpoint)
      .set('authorization', aFriend.accessToken);
    expect(aFriendTimeline.data).toHaveLength(5);

    const { body: userTimeline } = await testServer
      .get(endpoint)
      .set('authorization', createdTestUser[0].body.accessToken);
    expect(userTimeline.data).toHaveLength(6);
  });
 */