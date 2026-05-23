//middleware que comprueba si el usuario tiene rol de admin
//siempre se usa después del middleware de auth, que ya verifica el token
module.exports = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso restringido a administradores' });
  }
  next();
};