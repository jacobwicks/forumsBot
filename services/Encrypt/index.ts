import * as bcrypt from 'bcrypt';
import { getPassword } from '../Config';

export const hashPromise = (arg: string) =>
    new Promise<string>((resolve, reject) => {
        bcrypt.hash(arg, 10, (err, hash) => {
            if (err) reject(err);
            resolve(hash);
        });
    });

//encrypt provided password, compare with hashedPassword retrieved from the database
export const passwordMatch = async (password: string) => {
    const hashedPassword = await getPassword();
    if (hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    } else return false;
};
