const oauth2Client = require('../config/google');
const User = require('../models/User');

//Readme - OAuth2 client - google api nodejs client

const googleAuth = (req, res) => {
    const scopes = [
        'https://www.googleapis.com/auth/calendar'
      ];
      
      const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
      });

return res.redirect(url)

}

const googleCallback = async (req, res) => {
    try {
        const {code} =  req.query
        const {tokens} = await oauth2Client.getToken(code)
        oauth2Client.setCredentials(tokens)


        const id = req.user._id
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


