# laravel-passport-socialite-react
Boilerplate for reactjs (16) and laravel (5.6) with passport and socialite.  0

# Usage :
1. Rename .env.example to .env
2. Update DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD, and Social IDs in .env file to yours.
3. In command line :
   - composer update
   - php artisan key:generate
   - php artisan migrate
   - php artisan db:seed
   	- (if you want to have an admin account. email: admin@domain.com | pass: secret)
   - php artisan passport:install
4. npm install
5. npm run dev

# Features:
This repository already configured with:
x Semantic UI React => https://react.semantic-ui.com/introduction (on-going migration to BlueprintJS 3)
- Animate css => https://daneden.github.io/animate.css/
- Redux persist (For local storage) => https://www.npmjs.com/package/redux-persist
- Socialite => (https://laravel.com/docs/5.6/socialite)
- Passport => (https://laravel.com/docs/5.6/passport)
- Bootstrap 4
- BlueprintJS

# To-Do list :
- User registration => Done
- User login  => Done
- Forgot password => Done
- Social login => Done (Facebook, Office365) Pending (Twitter, LinkedIn, Google)
- Laravel permissions => X
- React permissions (CASL) => X
- Tests => X
- CRUDs => X
- Socket.IO (for Real-time functionality) => X

This project is open for contribution.
kitseno@gmail.com

*** 
*** Credits to sumityadavbadli@gmail.com and https://github.com/moeen-basra
*** This boilerplate is derived from 'react-laravel-with-jwt-authentication' and 'https://github.com/moeen-basra/laravel-react'
*** 
