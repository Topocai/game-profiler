const genders = Object.freeze({
    MALE: {
        display: 'Male',
    },
    FEMALE: {
        display: 'Female',
    },
    NON_BINARY: {
        display: 'Non-binary',
    },
    GENDERQUEER: {
        display: 'Genderqueer',
    },
    GENDERFLUID: {
        display: 'Genderfluid',
    },
    AGENDER: {
        display: 'Agender',
    },
    BINARY: {
        display: 'Binary',
    },
    OTHER: {
        display: 'Other',
    },
    PREFER_NOT_TO_SAY: {
        display: 'Prefer not to say',
    },
})

const plataforms = Object.freeze({
    PC: {
        display: 'PC',
    },
    PS: {
        display: 'PlayStation',
    },
    XBOX: {
        display: 'XBOX',
    },
    NINTENDO: {
        display: 'Nintendo',
    },
    MOBILE: {
        display: 'MOBILE',
    },

})

module.exports = { genders, plataforms }