import passport from 'passport';
import passportJWT from 'passport-jwt';
import { publicKEY } from '../../configs/JWT';

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

var jwtOptions = {
    jwtFromRequest,
    secretOrKey: publicKEY,
};

const preparedStrategy = new JwtStrategy(
    jwtOptions,
    async (jwtPayload, next) => {
        console.log('payload received', jwtPayload);
        next(null, true);
        // if (!!user) {
        //     next(null, user);
        // } else {
        //     next(null, false);
        // }
    }
);

passport.use(preparedStrategy);

export default passport.authenticate('jwt', {
    session: false,
});
