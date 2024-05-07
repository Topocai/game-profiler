const variables = require('../variables')

const dummyUser = {
  username: 'dummy',
  password: 'dummy123',
  name: 'Super Dummy',
  email: 'dummy@gmail.com'
}

const dummyUserData = {
  user_gender: variables.genders.FEMALE.id,
  user_avatar: 'https://thumbs2.imgbox.com/4a/c0/ctmigkfs_t.jpg',
  user_platform: [variables.plataforms.PC.id],
  birthday: new Date('2006-06-06'),
  created_at: Date.now(),
  gamesList: {
    finished: [4445],
    playing: [5432]
  }
}

const dummyGameUserData = {
  game_id: 4445,
  status: 'Playing',
  score: 8,
  started_at: null,
  finished_at: null,
  hours_played: 12,
  platform_played: [variables.plataforms.PC.id],
  review: 'Es una cagada de juego',
  favorite: false
}

module.exports = {
  dummyGameUserData,
  dummyUserData,
  dummyUser
}
