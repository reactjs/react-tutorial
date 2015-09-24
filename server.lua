-- This file provided by Facebook is for non-commercial testing and evaluation
-- purposes only. Facebook reserves all rights not expressly granted.
--
-- THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
-- IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
-- FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
-- FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
-- ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
-- WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE

--
-- For use with Algernon / Lua
--
-- Project page: https://github.com/xyproto/algernon
-- Web page: http://algernon.roboticoverlords.org/
--

handle("/api/comments", function()

  -- Set the headers
  content("application/javascript")
  setheader("Cache-Control", "no-cache")

  -- Use a JSON file for the comments
  comments = JFile("comments.json")

  -- Handle requests
  if method() == "POST" then
    -- Add the form data table to the JSON document
    comments:add(ToJSON(formdata(), 4))
  end

  -- Return the contents of the JSON file
  print(tostring(comments))

end)

servedir("/", "public")
