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

        res.redirect('http://localhost:5173/dashboard?google=connected')

    } catch (error) {
        res.status(500).json({message: 'Error al conectar'})
    }

}

const disconnectGoogle = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      googleAccessToken: null,
      googleRefreshToken: null
    })
    res.status(200).json({ message: 'Google desconectado' })
  } catch (error) {
    res.status(500).json({ message: 'Error al desconectar' })
  }
}

module.exports = { googleAuth, googleCallback, disconnectGoogle }


