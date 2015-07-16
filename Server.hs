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

    get "/comments.json" $ do
      comments <- liftIO $ readFile "comments.json"
      json $ fromJust $ (decode comments :: Maybe [Comment])
           
    post "/comments.json" $ do
      comments <- liftIO $ BS.readFile "comments.json"
      let jsonComments = fromJust $ (decode $ fromStrict comments :: Maybe [Comment])
      author <- param "author"
      comment <- param "text"
      let allComments = jsonComments ++ [Comment comment author]
      liftIO $ writeFile "comments.json" (encode allComments)
      json allComments


