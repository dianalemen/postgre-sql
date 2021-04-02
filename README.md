# This is the simple GRUD with postgresql

## In use:

 - TypeScript
 - ESLint
 - Express

## How to run the app

 - Run the `npm run nodemon`. Nodemon starts app in watchmode on the `port: 3001`

## Service includes:
 - get user by id
 - create & update user
 - get auto-suggested list from `limit` users, sorted by login property and filtered by `loginSubstring` in the login property: `getAutoSuggestUsers(loginSubstring, limit)`
 - remove user (soft delete - user gets marked with `isDeleted` flag but not removed from the collection)

### All users are stored in the postgre-sql

 - The DB is hoisted on the [heroku](https://www.heroku.com). For more info check the link [heroku postgres](https://www.heroku.com/postgres)
