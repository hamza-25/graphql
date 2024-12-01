import User from '../../models/User.mjs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userResolver = {
    Query: {
        usersGet: async () => {
            const users = await User.find();
            return users;
        }, 
    },
    Mutation: {
        userCreate: (async ({name, email, password}) => {
            const userExists = await User.findOne({email});
            if(userExists)
                throw new Error(`user exists`);
            if(password.length === 0)
                throw new Error(`password can't be empty`);
            const hashPassword = await bcrypt.hash(password, 10);
            const userData = {name, email, password: hashPassword};
            const user = new User(userData);
            await user.save();
            return{
                name,
                email,
            }
        }),
        userLogin: (async ({email, password}) => {
            const userexists = await User.findOne({email});
            const validPass = await bcrypt.compare(password, userexists.password);
            if (!userexists || !validPass)
                throw new Error(`invalid credentials`);
            const token = jwt.sign({userId: userexists._id}, process.env.SECRET, {expiresIn: '24h'});
            return token;
        }),
    }
}

export default userResolver;