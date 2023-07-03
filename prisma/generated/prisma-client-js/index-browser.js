
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum
} = require('./runtime/index-browser')


const Prisma = {}

exports.Prisma = Prisma

/**
 * Prisma Client JS version: 4.12.0
 * Query Engine version: 659ef412370fa3b41cd7bf6e94587c1dfb7f67e7
 */
Prisma.prismaVersion = {
  client: "4.12.0",
  engine: "659ef412370fa3b41cd7bf6e94587c1dfb7f67e7"
}

Prisma.PrismaClientKnownRequestError = () => {
  throw new Error(`PrismaClientKnownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  throw new Error(`PrismaClientUnknownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientRustPanicError = () => {
  throw new Error(`PrismaClientRustPanicError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientInitializationError = () => {
  throw new Error(`PrismaClientInitializationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientValidationError = () => {
  throw new Error(`PrismaClientValidationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.NotFoundError = () => {
  throw new Error(`NotFoundError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  throw new Error(`sqltag is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.empty = () => {
  throw new Error(`empty is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.join = () => {
  throw new Error(`join is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.raw = () => {
  throw new Error(`raw is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.validator = () => (val) => val


/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}

/**
 * Enums
 */
// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275
function makeEnum(x) { return x; }

exports.Prisma.ArticleScalarFieldEnum = makeEnum({
  id: 'id',
  title: 'title',
  content: 'content',
  userId: 'userId',
  bogus: 'bogus',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

exports.Prisma.CompScalarFieldEnum = makeEnum({
  id: 'id',
  compId: 'compId',
  club: 'club',
  boat: 'boat',
  skipper: 'skipper',
  fleet: 'fleet',
  division: 'division',
  rating: 'rating',
  rank: 'rank',
  nett: 'nett',
  total: 'total',
  rest: 'rest',
  publisherId: 'publisherId',
  eventId: 'eventId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

exports.Prisma.EventScalarFieldEnum = makeEnum({
  id: 'id',
  eventeid: 'eventeid',
  uniqueIdString: 'uniqueIdString',
  name: 'name',
  eventwebsite: 'eventwebsite',
  email: 'email',
  venueName: 'venueName',
  description: 'description',
  titleImage: 'titleImage',
  public: 'public',
  fileInfo: 'fileInfo',
  resultColumns: 'resultColumns',
  rest: 'rest',
  publisherId: 'publisherId',
  venueId: 'venueId',
  organizationId: 'organizationId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  seriesId: 'seriesId'
});

exports.Prisma.FollowScalarFieldEnum = makeEnum({
  id: 'id',
  userId: 'userId',
  type: 'type',
  seriesId: 'seriesId',
  eventId: 'eventId',
  organizationId: 'organizationId',
  raceId: 'raceId',
  compId: 'compId',
  updatedAt: 'updatedAt',
  createdAt: 'createdAt'
});

exports.Prisma.JsonNullValueFilter = makeEnum({
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
});

exports.Prisma.KeyScalarFieldEnum = makeEnum({
  id: 'id',
  hashed_password: 'hashed_password',
  user_id: 'user_id',
  primary: 'primary'
});

exports.Prisma.LikeScalarFieldEnum = makeEnum({
  id: 'id',
  userId: 'userId',
  type: 'type',
  seriesId: 'seriesId',
  eventId: 'eventId',
  organizationId: 'organizationId',
  raceId: 'raceId',
  compId: 'compId',
  updatedAt: 'updatedAt',
  createdAt: 'createdAt'
});

exports.Prisma.NullableJsonNullValueInput = makeEnum({
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
});

exports.Prisma.OrganizationScalarFieldEnum = makeEnum({
  id: 'id',
  name: 'name',
  description: 'description',
  tag: 'tag',
  website: 'website',
  email: 'email',
  contact: 'contact',
  titleImage: 'titleImage',
  ownerId: 'ownerId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

exports.Prisma.RaceScalarFieldEnum = makeEnum({
  id: 'id',
  raceId: 'raceId',
  uniqueRaceString: 'uniqueRaceString',
  name: 'name',
  starts: 'starts',
  rank: 'rank',
  date: 'date',
  time: 'time',
  notes: 'notes',
  sailed: 'sailed',
  resultColumns: 'resultColumns',
  rest: 'rest',
  eventId: 'eventId',
  publisherId: 'publisherId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

exports.Prisma.ResultScalarFieldEnum = makeEnum({
  id: 'id',
  resultId: 'resultId',
  finish: 'finish',
  start: 'start',
  points: 'points',
  position: 'position',
  discard: 'discard',
  corrected: 'corrected',
  resultType: 'resultType',
  elasped: 'elasped',
  supposedRating: 'supposedRating',
  elapsedWin: 'elapsedWin',
  ratingWin: 'ratingWin',
  rrset: 'rrset',
  publisherId: 'publisherId',
  eventId: 'eventId',
  compId: 'compId',
  raceId: 'raceId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

exports.Prisma.SeriesScalarFieldEnum = makeEnum({
  id: 'id',
  name: 'name',
  description: 'description',
  rest: 'rest',
  organizationId: 'organizationId',
  publisherId: 'publisherId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

exports.Prisma.SessionScalarFieldEnum = makeEnum({
  id: 'id',
  user_id: 'user_id',
  active_expires: 'active_expires',
  idle_expires: 'idle_expires'
});

exports.Prisma.SortOrder = makeEnum({
  asc: 'asc',
  desc: 'desc'
});

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = makeEnum({
  id: 'id',
  name: 'name',
  username: 'username',
  email: 'email',
  avatar: 'avatar'
});

exports.Prisma.UserSettingsScalarFieldEnum = makeEnum({
  id: 'id',
  theme: 'theme',
  language: 'language',
  userId: 'userId'
});

exports.Prisma.VenueScalarFieldEnum = makeEnum({
  id: 'id',
  name: 'name',
  website: 'website',
  email: 'email',
  burgee: 'burgee',
  publisherId: 'publisherId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});
exports.Lang = makeEnum({
  english: 'english',
  french: 'french',
  spanish: 'spanish',
  german: 'german',
  dutch: 'dutch',
  swedish: 'swedish',
  russian: 'russian',
  chinese: 'chinese',
  japanese: 'japanese',
  norweigen: 'norweigen',
  italian: 'italian',
  portugese: 'portugese'
});

exports.Prisma.ModelName = makeEnum({
  Series: 'Series',
  Event: 'Event',
  Race: 'Race',
  Comp: 'Comp',
  Result: 'Result',
  Organization: 'Organization',
  follow: 'follow',
  like: 'like',
  Venue: 'Venue',
  User: 'User',
  UserSettings: 'UserSettings',
  Session: 'Session',
  Key: 'Key',
  Article: 'Article'
});

/**
 * Create the Client
 */
class PrismaClient {
  constructor() {
    throw new Error(
      `PrismaClient is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
    )
  }
}
exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
