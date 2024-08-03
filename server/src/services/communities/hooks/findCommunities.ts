import { Op } from '@sequelize/core';
import { HookContext } from '@feathersjs/feathers';

export default async (context: HookContext) => {
  const { app, params } = context;
  const Sequelize = app.get('sequelizeClient');

  const { filters, query: where } = context.app
    .service(context.path)
    .filterQuery(context.params);

  let order = [];
  if (filters.$sort) {
    const { amountOfMembers } = filters.$sort;
    const customFilters: any = {};
    if (amountOfMembers) {
      customFilters.numMembers = amountOfMembers; // rename amountOfMembers to numMembers
      delete filters.$sort.amountOfMembers;
    }
    const allField = { ...filters.$sort, ...customFilters };
    order = Object.keys(allField).map((key) => {
      const descAsc = allField[key] === 1 ? 'ASC' : 'DESC';
      if (customFilters[key])
        return [[Sequelize.literal(`"${key}"`), `${descAsc}`]];
      return [`${key}`, descAsc];
    });
  }

  const OnlyInterests = (interest) =>
    `(
  EXISTS(
    SELECT 1 FROM interests AS "I" 
    INNER JOIN community_interests AS "CI" ON "CI"."interest_id"="I".id AND "CI"."community_id"="Community".id
    WHERE "I"."name"= '${interest}' )
  
  )`;

  let interests;
  if (where.interests) {
    interests = where.interests;
    delete where.interests;
  }
  let participate;
  if (where.participate) {
    participate = where.participate;
    delete where.participate;
  }
  const isMember = `(
  SELECT 
    json_build_object(
     'id', "CU".user_id,
     'role',"CR"."name",
     'roleId',"CR".id
    ) 
    FROM "community_users" AS "CU"
    INNER JOIN roles AS "CR" ON "CR".id = "CU".community_role_id
    WHERE "CU".community_id="Community".id and "CU".user_id='${context.params.User.id}'
    LIMIT 1
  )`;

  const Interests = `(
SELECT 
  json_agg(
    json_build_object(
      'name',"I"."name",
      'id',"I".id
  )) FROM interests AS "I" 
  INNER JOIN community_interests AS "CI" ON "CI"."interest_id" = "I".id
  WHERE "CI"."community_id"="Community".id
)`;

  const members = `(SELECT 
  json_agg(
    json_build_object('id', "U".id,
      'firstName',"U".first_name,
      'lastName',"U".last_name,
      'profilePicture',"U".profile_picture,
      'createdAt',"U".created_at,
      'updatedAt',"U".updated_at,
      'role',"CR"."name",
      'roleId',"CR".id
    )
  ) 
  FROM "community_users" AS "CU" 
  INNER JOIN roles AS "CR" ON "CR".id = "CU".community_role_id
  INNER JOIN users AS "U" ON "CU".user_id="U".id
  WHERE "CU".user_id="U".id AND "CU".community_id="Community".id
  LIMIT 10
  )`;

  const isBanned = `(
     EXISTS (
      SELECT 1 FROM "community_bans" AS "cb"
      WHERE "cb"."community_id"="Community".id  AND 
      "cb"."user_id"='${context.params.User.id}' AND
      "cb"."until" > NOW() 
      )
  )`;

  const isParticipant = `(
    EXISTS (
      SELECT 1 FROM "community_users" AS "cu" 
      WHERE "cu"."community_id"="Community".id  AND 
      "cu"."user_id"='${context.params.User.id}'
      )
  )`;

  const pendingInvitation = `(
    SELECT 
    json_agg(
    json_build_object(
      'id', cir.id,
      'role', roles."name",
      'roleId', roles.id,
      'createdAt', cir.created_at,
      'updatedAt', cir.updated_at,
      'hostId', cir.host_id,
      'guestId', cir.guest_id
      )
      )
     FROM community_invitation_requests AS cir 
     INNER JOIN roles ON roles.id = cir.community_role_id
     WHERE cir.community_id="Community".id 
     AND cir.guest_id='${context.params.User.id}' 
     AND cir."response" IS NULL
  )`;
  const clause = {
    // loging: console.log,
    ...where,

    [Op.and]: [
      Sequelize.where(Sequelize.literal(isBanned), false),

      {
        [Op.or]: [
          { privacyType: { [Op.ne]: 'hidden' } },
          //
          {
            [Op.and]: [
              { privacyType: 'hidden' },
              Sequelize.where(Sequelize.literal(isParticipant), true),
            ],
          },
        ],
      },
    ],
  };

  if (interests) {
    clause[Op.and].push(
      Sequelize.where(Sequelize.literal(OnlyInterests(interests)), true)
    );
  }
  if (participate) {
    clause[Op.and].push(
      Sequelize.where(Sequelize.literal(isParticipant), true)
    );
  }
  params.sequelize = {
    where: clause,
    // logging: interests ? console.log : null,
    attributes: {
      include: [
        [Sequelize.literal(isMember), 'IsMember'],
        [Sequelize.literal(Interests), 'Interests'],
        [Sequelize.literal(members), 'members'],
        [Sequelize.literal(pendingInvitation), 'pendingInvitation'],
      ],
    },
    include: { model: Sequelize.models.CommunityUsers, required: true },

    order,
    raw: false,
  };

  return context;
};
