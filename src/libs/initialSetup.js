import Person from '../models/Person';

export const createAdmin = async() => {
    // check for an existing admin user
    const user = await Person.findOne({ id: 111 });

    if (!user) {
        // create a new admin user
        const createdUser = await Person.create({
            first_name: "admin",
            last_name: "CW",
            id: 111,
            password: await Person.encryptPassword('12345'),
            role: "admin"
        });

        console.log('Admin User Created!')
    }
};