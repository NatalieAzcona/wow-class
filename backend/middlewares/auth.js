const User = require('../models/User')
const { verifyJwt } = require('../utils/token')


//Revisamos si el user tiene el token

const isAuth = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if(!token) return res.status(401).json("Sin autorización")
  try {
  const decoded = verifyJwt(token)
  req.user = await User.findById(decoded.id)  
  next()  
  } catch (error) {
      return res.status(401).json("Sin autorización")
    }


}

const isAdmin = (req, res, next) => { 
    if (req.user.role !== 'admin') {       
       return res.status(403).json({message: "solo un admin puede hacer esto"})
    }
     next()
 }
 

const isTeacherOrAdmin = (req, res, next) => { 
   if (req.user.role !== 'teacher' && req.user.role !== 'admin') {       
      return res.status(403).json({message: "solo un profesor o admin puede hacer esto"})
   }
    next()
}


module.exports = {isAdmin, isTeacherOrAdmin, isAuth};
