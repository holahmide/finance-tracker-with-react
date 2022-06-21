# Getting Started with a Basic Finance Tracker App (BTrack)
> The application allows users to track their daily spendings and set limits for a particular period of time.

> The project uses NodeJs Package Manager (NPM), ReactJS and TailwindCSS.
#### Setup codebase

```
git clone https://github.com/holahmide/finance-tracker.git finance-tracker-frontend

cd finance-tracker-frontend

npm install

```

#### Connect Backend

- Pull the Backend Repository https://github.com/holahmide/finance-tracker-api.git.
- Setup the API using the README file as a guide

#### Add enviromental variables

```
touch .env
nano .env
```

Add the properties in the `.env.example` file to the `.env` file

```
Set the BACKEND_URL Parameter (e.g. http://127.0.0.1:4000/api/).
NOTE: The HOST url e.g. 127.0.0.1 must be the same as the HOST url of your backend server.
```

### Running application

```
# for development testing
npm start

```
### Contributions

Feel free to clone, add improvements and open pull requests.
