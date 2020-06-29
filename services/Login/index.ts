import { getPassword } from '../Config';
import * as jwt from 'jsonwebtoken';
import { jwtOptions, privateKEY } from '../../configs/JWT';
//import * as bcrypt from 'bcrypt';

export const login = async (password: string) => {
    const storedPassword = await getPassword();

    //     //encrypt provided password, compare with hashedPassword retrieved from the database
    //     const passwordMatch = await bcrypt.compare(password, hashedPassword);
    // }
    if (password === storedPassword) {
        const payload = {};
        //the jwt token itself
        const token = jwt.sign(payload, privateKEY, jwtOptions.signOptions);
        return token;
    } else return false;
};

export default login;
