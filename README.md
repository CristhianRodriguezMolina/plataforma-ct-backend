
# PECO - A platform to teach Computational thinking (CT) - Server

PECO is a platform that allows a completely management in the learning paths 
to the leave the students introduce in the world of the computer science while 
they get fun doing didactic activities

This repository only contains the Backend (Server).

Please make sure to visit the next repository to get the a completely functional 
platform:
[PECO - A platform to teach Computational thinking (CT) - Client](https://github.com/CristhianRodriguezMolina/plataforma-ct-frontend)









## Authors

- [@CristhianRodriguezMolina](https://github.com/CristhianRodriguezMolina)
- [@Wilzhar](https://github.com/Wilzhar)


## Requirements

- Node v14.15.1 or later
- MongoDB v4.4.6 or later
- Npm v6.14.8 or later
## Environment Variables

To run this project, you will need to create **.env** file and add the following environment variables

`PORT`: Set the port to run the app

`MONGODB_URI`: Set the Mongo database URI to connect

`USER_ADMIN`: Set username for your admin account

`USER_PASSWORD`: Set the password for your admin account

`SECRET_WORD`: Set a secret word to decode the users token

If you are not completely sure to what values set, you can use the following default values:

```
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/ct-database
USER_ADMIN=214896
USER_PASSWORD=Expedited-Wrongful3-Skewer
SECRET_WORD=9f4e58be-ddaa-464b-993e-d2262d6b545e
```



## Run Locally

Clone the project

- With https
```bash
  git clone https://github.com/CristhianRodriguezMolina/plataforma-ct-backend.git
```

- With SSH
```bash
  git clone git@github.com:CristhianRodriguezMolina/plataforma-ct-backend.git
```

Go to the project directory

```bash
  cd plataforma-ct-backend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

