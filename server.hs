{-# LANGUAGE DeriveGeneric     #-}
{-# LANGUAGE OverloadedStrings #-}

{-
  This file provided by Facebook is for non-commercial testing and evaluation
  purposes only. Facebook reserves all rights not expressly granted.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
  FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
  ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
  WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
-}

import Control.Monad.IO.Class (liftIO)
import Data.ByteString (readFile)
import Data.ByteString.Lazy (fromStrict, writeFile)
import Data.Aeson (FromJSON, ToJSON, decode)
import Data.Aeson.Encode.Pretty (Config (Config), encodePretty', keyOrder)
import Data.Time.Clock.POSIX (getPOSIXTime)
import GHC.Generics (Generic)
import Web.Scotty (ActionM, ScottyM, file, get, json, param, post, setHeader
                  ,scotty)

import Prelude hiding (id, readFile, writeFile)

data Comment = C { id :: Int, author :: String, text :: String }
  deriving (Generic, Show)

instance FromJSON Comment
instance ToJSON Comment

postComments :: ActionM ()
postComments = do
  cs <- readComments
  i <- liftIO $ round . (* 1000) <$> getPOSIXTime
  a <- param "author"
  t <- param "text"
  let cs' = (++ [C { id = i, author = a, text = t }]) <$> cs
  liftIO $ writeFile "comments.json"
         $ encodePretty' (Config 4 (keyOrder ["id", "author", "text"])) cs'
  presentComments cs'

getComments :: ActionM ()
getComments = presentComments =<< readComments

presentComments :: Maybe [Comment] -> ActionM ()
presentComments cs = do
  setHeader "Cache-Control"               "no-cache"
  setHeader "Access-Control-Allow-Origin" "*"
  json cs

readComments :: ActionM (Maybe [Comment])
readComments = do
  f <- liftIO $ readFile "comments.json"
  let cs = decode (fromStrict f) :: Maybe [Comment]
  pure cs

app :: ScottyM ()
app = do
  get "/"                   $ setHeader "Content-Type" "text/html"
                           >> file "public/index.html"
  get "/css/base.css"       $ file "public/css/base.css"
  get "/scripts/example.js" $ file "public/scripts/example.js"
  get "/api/comments"         getComments
  post "/api/comments"        postComments

main :: IO ()
main = scotty 3000 app
