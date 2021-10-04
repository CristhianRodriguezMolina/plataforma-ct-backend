import Person from '../models/Person';

export const createAdmin = async () => {
    // check for an existing admin user
    const user = await Person.findOne({ id: process.env.USER_ADMIN });

    if (!user) {
        // create a new admin user
        const createdUser = await Person.create({
            first_name: "Admin",
            last_name: "CW",
            genre: 'NB',
            image: '',
            id: process.env.USER_ADMIN,
            birth_date: new Date(2000, 4, 25),
            password: await Person.encryptPassword(process.env.USER_PASSWORD),
            role: "admin"
        });

        console.log('Admin User Created!');
    }
};