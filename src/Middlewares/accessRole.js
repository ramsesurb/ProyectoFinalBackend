export const privateAccess = (req,res,next)=>{
    if(!req.session.user) return res.redirect('/prods');
    next();
  }
  export const adminAccess = (req, res, next) => {
    if (req.session.user && req.session.user.rol === "admin") {
      next();
    } else {
      res.redirect("/register"); 
    }
  };
  export const adminOrPremiumAccess = (req, res, next) => {
    if (req.session.user && (req.session.user.rol === "admin" || req.session.user.rol === "premium")) {
      next();
    } else {
      res.redirect("/"); 
    }
  };
  export const userAccess = (req, res, next) => {
    if (req.session.user && (req.session.user.rol === "user" || req.session.user.rol === "premium")) {
      next();
    } else {
      res.redirect("/"); // Puedes redirigir a una página de acceso denegado o mostrar un mensaje de error
    }}