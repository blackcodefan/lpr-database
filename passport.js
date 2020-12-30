const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const User = require('./model').User;

const cookieExtractor = req =>{
    let token = null;
    if(req && req.cookies){
        token = req.cookies["access_token"];
    }
    return token;
};

/**===================================
 *  Authorization
 */
passport.use(new JwtStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: "lpr"
}, (payload, done) =>{
    User.findById({_id: payload.sub}, (error, user) =>{
        if(error)
            return done(error, false);
        if(user)
            return done(null, user);
        else return done(null, false);
    })
}));

/**==================================
 *  Authenticated local strategy using email and password
 */
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},(email, password, done) =>{
    User.findOne({email: email}, (error, user) =>{
        // something went wrong with server
        if(error)
            return done(error);
        // user doesn't exist
        if(!user)
            return done(null, false);
        // check if password is correct
        user.comparePassword(password, done)
    });
}));

module.exports = passport;