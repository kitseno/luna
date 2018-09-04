# Luna
<img src="https://laravel.com/assets/img/components/logo-laravel.svg" height="30">
<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K" alt="" height="30">
<label style="vertical-align: text-bottom">React</label>

A Laravel Boilerplate for Reactjs (16) and Laravel (5.7) with passport and socialite.

## Usage :
1. Rename `.env.example` to `.env`
2. Update **DB_HOST**, **DB_DATABASE**, **DB_USERNAME**, **DB_PASSWORD**, and **Social IDs** in `.env` file to yours.
3. In command line :
   - `composer update`
   - `php artisan key:generate`
   - `php artisan migrate`
   - `php artisan db:seed`
         - (if you want to have an admin account. email: admin@domain.com | pass: secret)
   - `php artisan passport:install`
4. `npm install`
5. `npm run dev` or `npm run watch`

##### Update the Passport keys in .env file
Copy the keys for personal and password grants in `.env` file

```
PERSONAL_CLIENT_ID=1
PERSONAL_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PASSWORD_CLIENT_ID=2
PASSWORD_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Features:
This repository already configured with:
- Animate css => https://daneden.github.io/animate.css/
- Redux persist (For local storage) => https://www.npmjs.com/package/redux-persist
- Socialite => (https://laravel.com/docs/5.6/socialite)
- Passport => (https://laravel.com/docs/5.6/passport)
- Bootstrap 4
- BlueprintJS
- ~~Semantic UI React => https://react.semantic-ui.com/introduction~~ (on-going migration to BlueprintJS 3)

## To-Do list :
- [x] User registration
- [x] User login
- [x] Forgot password
- [x] Social login (Facebook, Office365, Twitter, LinkedIn, Google)
- [x] Laravel permissions
- [x] React permissions (CASL)
- [ ] Tests
- [ ] CRUDs
- [ ] Socket.IO (for Real-time functionality)

This project is open for contribution.
kitseno@gmail.com

```
Credits to sumityadavbadli@gmail.com and https://github.com/moeen-basra
This boilerplate is derived from 'react-laravel-with-jwt-authentication' and 'https://github.com/moeen-basra/laravel-react'
``` 
