# package tracking frontend

react app (vite). talks to userservice (5001) and orderservice (5002).

## how to run

```
npm install
npm run dev
```

open http://localhost:5173

## pages so far

- /register
- /login
- /createorder (user)

## notes for team

- `src/api.js` has `userapi` and `orderapi` (the token is added automatically to order requests)
- `src/protect.jsx` checks the role before opening a page
- /myorders, /courier and /admin are placeholders (`soon.jsx`), replace them with real pages
