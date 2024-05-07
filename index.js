const app = require('./app.js')
const config = require('./utils/config.js')

app.listen(config.PORT, () => console.log(`Listening on port ${config.PORT}`))

/// /////////////////////////////////////////////////////////USER API ROUTES///////////////////////////////////////////////////////
