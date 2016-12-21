--
-- Use together with Algernon, which has a built-in Lua interpreter.
-- 
-- Algernon web page: http://algernon.roboticoverlords.org/
-- Algernon project page: https://github.com/xyproto/algernon
-- Gopher-Lua: https://github.com/yuin/gopher-lua
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
