const genders = Object.freeze({
  MALE: {
    id: 'male',
    display: 'Male'
  },
  FEMALE: {
    id: 'female',
    display: 'Female'
  },
  NON_BINARY: {
    id: 'non_binary',
    display: 'Non-binary'
  },
  GENDERQUEER: {
    id: 'genderqueer',
    display: 'Genderqueer'
  },
  GENDERFLUID: {
    id: 'genderfluid',
    display: 'Genderfluid'
  },
  AGENDER: {
    id: 'agender',
    display: 'Agender'
  },
  BINARY: {
    id: 'binary',
    display: 'Binary'
  },
  OTHER: {
    id: 'other',
    display: 'Other'
  },
  PREFER_NOT_TO_SAY: {
    id: 'prefer_not_to_say',
    display: 'Prefer not to say'
  }
})

const plataforms = Object.freeze({
  PC: {
    id: 'pc',
    display: 'PC'
  },
  PS: {
    id: 'ps',
    display: 'PlayStation'
  },
  XBOX: {
    id: 'xbox',
    display: 'XBOX'
  },
  NINTENDO: {
    id: 'nintendo',
    display: 'Nintendo'
  },
  MOBILE: {
    id: 'mobile',
    display: 'MOBILE'
  }
})

const gameStates = Object.freeze({
  PLAYING: {
    id: 'playing',
    display: 'Playing'
  },
  FINISHED: {
    id: 'finished',
    display: 'Finished'
  },
  ABANDONED: {
    id: 'abandoned',
    display: 'Abandoned'
  },
  ON_HOLD: {
    id: 'on_hold',
    display: 'On Hold'
  },
  PLAN_TO_PLAY: {
    id: 'plan_to_play',
    display: 'Plan to play'
  }
})

module.exports = { genders, plataforms, gameStates }
