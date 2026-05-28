const oauth2Client = require('../config/google');
const User = require('../models/User');
const { verifyJwt } = require('../utils/token');

//Readme - OAuth2 client - google api nodejs client


//Define scope, genera url en offline para que google devuelva el reefresh_token, luego redirige al usuario a pantalla de permisos
const googleAuth = (req, res) => {

    const { token } = req.query
    const scopes = [
        'https://www.googleapis.com/auth/calendar'
      ];
      
      const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        state: token,
        prompt: 'consent'
      });

return res.redirect(url)

}

const googleCallback = async (req, res) => {
    try {
        const {code, state } =  req.query
        const {tokens} = await oauth2Client.getToken(code)
        oauth2Client.setCredentials(tokens)

        const verifiedState = verifyJwt(state)

        const id = verifiedState.id
        const {access_token, refresh_token } = tokens
        await User.findByIdAndUpdate(id,  {
            googleAccessToken: access_token,
            googleRefreshToken: refresh_token
        })

        res.json({message: 'Conectado', tokens})

    } catch (error) {
        res.status(500).json({message: 'Error al conectar'})
    }

}

module.exports = {googleAuth, googleCallback}


