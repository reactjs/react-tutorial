--
-- For use with Algernon / Lua
-- 
-- Project page: https://github.com/xyproto/algernon
-- Web page: http://algernon.roboticoverlords.org/
--

-- Set the headers
content("application/javascript")
setheader("Cache-Control", "no-cache")

-- Use a Redis list for the comments
comments = List("comments")

-- Handle requests
if method() == "POST" then
  -- Add the form data to the comment list, as JSON
  comments:add(JSON(formdata()))
else
  -- Combine all the JSON comments to a JSON document
  print("["..table.concat(comments:getall(), ",").."]")
end
