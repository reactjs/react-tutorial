-- This file provided by Facebook is for non-commercial testing and evaluation
-- purposes only. Facebook reserves all rights not expressly granted.
--
-- THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
-- IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
-- FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
-- FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
-- ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
-- WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE

{-# LANGUAGE OverloadedStrings #-}

module Main (main) where

import Web.Scotty

import Control.Monad (mzero)
import Control.Monad.Trans
import Network.Wai.Middleware.Static
import Network.Wai.Middleware.RequestLogger (logStdoutDev)
import Data.ByteString.Lazy (readFile, writeFile, fromStrict)
import qualified Data.ByteString as BS (readFile)
import Prelude hiding (readFile, writeFile)
import Data.Aeson hiding (json)
import Data.Text
import Data.Maybe (fromJust)

data Comment = Comment {
      commentText :: Text,
      author :: Text
    } deriving (Eq, Show, Ord)

instance FromJSON Comment where
    parseJSON (Object v) = Comment <$>
                           v .: "text" <*>
                           v .: "author"
    parseJSON _ = mzero

instance ToJSON Comment where
     toJSON (Comment ctext author) = object ["text" .= ctext, "author" .= author]


main :: IO ()
main = scotty 3000 $ do

    middleware $ staticPolicy (noDots >-> addBase "public")
    middleware logStdoutDev

    get "/" $ file "./public/index.html"

    get "/api/comments" $ do
      comments <- liftIO $ readFile "comments.json"
      json $ fromJust $ (decode comments :: Maybe [Comment])

    post "/api/comments" $ do
      comments <- liftIO $ BS.readFile "comments.json"
      let jsonComments = fromJust $ (decode $ fromStrict comments :: Maybe [Comment])
      author <- param "author"
      comment <- param "text"
      let allComments = jsonComments ++ [Comment comment author]
      liftIO $ writeFile "comments.json" (encode allComments)
      json allComments
