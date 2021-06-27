import Person from '../models/Person';

export const createAdmin = async () => {
    // check for an existing admin user
    const user = await Person.findOne({ id: 111 });

    if (!user) {
        // create a new admin user
        const createdUser = await Person.create({
            first_name: "Admin",
            last_name: "CW",
            genre: 'NB',
            image: 'admin-profile.jpg',
            id: 111,
            birth_date: new Date(2000, 4, 25),
            password: await Person.encryptPassword('12345'),
            role: "admin"
        });

        console.log('Admin User Created!')
    }
};