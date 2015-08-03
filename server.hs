{-# LANGUAGE DeriveDataTypeable #-}
-- To run this server, you'll need the HTTP server module
-- The version used for this server:
-- * http-server
--    Synopsis: A library for writing Haskell web servers.
--    Default available version: 1.0.6
--    Installed versions: 1.0.6
--    Homepage: https://github.com/GaloisInc/http-server
--    License:  BSD3
-- 
-- To install it: `cabal install http-server`

import Network.HTTP.Server
import Network.HTTP.Server.Logger
import Network.URL as URL
import System.FilePath
import Text.JSON.Generic
import Data.List
import Codec.Binary.UTF8.String
import Control.Applicative

data Comment = Comment {author :: String , text :: String} deriving (Data, Typeable, Show)

main :: IO ()
main = serverWith config (\_ url request -> handleRequest url request)
    where config = (defaultConfig {srvLog = stdLogger, srvPort = 3000})

handleRequest url request = 
    let path = (takeFileName.url_path) url 
        method = rqMethod request 
        body = rqBody request 
    in handleRequest' path method body

handleRequest' path GET _  
    | path == "" = makeResponse OK "text/html" <$> readFile "index.html"
    | path == "comments.json"  =  makeResponse OK "application/json" <$> readFile path
    | otherwise = return $ makeResponse NotFound "text/plain" "Unknown file"
handleRequest' "comments.json" POST body =  makeResponse OK "application/json" <$> writeNewComment body

newComment body = let commentStr = decodeString body in 
    decodeJSON commentStr :: Comment

writeNewComment body = 
    do commentStr <- readFile "comments.json"
       newComments <- return $ encodeJSON ((decodeJSON commentStr) ++ [decodeJSON body :: Comment])
       length newComments `seq` (writeFile "comments.json" newComments)
       return newComments

processPost url request comments = 
    let txt = decodeString(rqBody request) in
        comments ++ [(decodeJSON txt :: Comment)]

makeResponse :: StatusCode -> String -> String -> Response String
makeResponse status contentEncoding str = 
    let encodedStr = encodeString str            
    in 
        insertHeader HdrContentLength (show $ length encodedStr)
        $ insertHeader HdrContentEncoding "UTF-8"
        $ insertHeader HdrContentEncoding contentEncoding
        $ (respond status :: Response String) {rspBody = encodedStr}