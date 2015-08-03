[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

# React Tutorial

This is the React comment box example from [the React tutorial](http://facebook.github.io/react/docs/tutorial.html).

## To use

There are several simple server implementations included. They all serve static files from `public/` and handle requests to `comments.json` to fetch or add data. Start a server with one of the following:

### Node

```sh
npm install
node server.js
```

### Python

```sh
pip install -r requirements.txt
python server.py
```

### Haskell

```sh
cabal sandbox init
cabal install --only-dependencies
ghc Server.hs
./Server
```

### Ruby
```sh
ruby server.rb
```

### PHP
```sh
php server.php
```

### Go
```sh
go run server.go
```

### Lua

```sh
go get github.com/xyproto/algernon
# or brew install algernon
algernon server.lua
```

### Haskell
```
cabal sandbox init
cabal install http-server==1.0.6
ghc server.hs
./server
```

And visit <http://localhost:3000/>. Try opening multiple tabs!
