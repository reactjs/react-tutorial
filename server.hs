{-# LANGUAGE DeriveDataTypeable #-}
import Network.HTTP.Server
import Network.HTTP.Server.Logger
import Network.URL as URL
import System.FilePath
import Text.JSON.Generic
import Data.List
import Codec.Binary.UTF8.String
import Control.Monad
import Debug.Trace

data Comment = Comment {author :: String , text :: String} deriving (Data, Typeable, Show)

main :: IO ()
main = serverWith config (\_ url request -> handleRequest url request)
    where config = (defaultConfig {srvLog = stdLogger, srvPort = 3000})

handleRequest url request = 
    let path = (takeFileName.url_path) url 
        method = rqMethod request 
        body = rqBody request 
    in handleRequest' path method body

requestError = return $ makeResponse BadRequest "application/json" "{\"error\" : \"I don't known what you want\"}"
handleRequest' path GET _  
    | path == "" = makeResponse OK "text/html" `liftM` readFile "helloworld.html"
    | "html" `isSuffixOf` path =  makeResponse OK "text/html" `liftM` readFile path
    | "json" `isSuffixOf` path =  makeResponse OK "application/json" `liftM` readFile path
    | "js" `isSuffixOf` path =  makeResponse OK "text/javascript" `liftM` readFile path
    | otherwise = requestError
handleRequest' "comments.json" POST body = 
    do  commentStr <- writeNewComment body 
        return $ makeResponse OK "application/json" commentStr

newComment body = let commentStr = decodeString body in 
    trace ("The body is"++body) (decodeJSON commentStr :: Comment)

writeNewComment body = 
    do commentStr <- readFile "comments.json"
       newComments <- return $ trace body (encodeJSON ((decodeJSON commentStr) ++ [decodeJSON body :: Comment])) 
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