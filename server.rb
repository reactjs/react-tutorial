# This file provided by Facebook is for non-commercial testing and evaluation
# purposes only. Facebook reserves all rights not expressly granted.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
# FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
# ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
# WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

require 'webrick'
require 'json'

port = ENV['PORT'].nil? ? 3000 : ENV['PORT'].to_i

puts "Server started: http://localhost:#{port}/"

root = File.expand_path './public'
server = WEBrick::HTTPServer.new Port: port, DocumentRoot: root

server.mount_proc '/api/comments' do |req, res|
  comments = JSON.parse(File.read('./comments.json', encoding: 'UTF-8'))

  if req.request_method == 'POST'
    # Assume it's well formed
    comment = { id: (Time.now.to_f * 1000).to_i }
    req.query.each do |key, value|
      comment[key] = value.force_encoding('UTF-8')
    end
    comments << comment
    File.write(
      './comments.json',
      JSON.pretty_generate(comments, indent: '    '),
      encoding: 'UTF-8'
    )
  end

  # always return json
  res['Content-Type'] = 'application/json'
  res['Cache-Control'] = 'no-cache'
  res.body = JSON.generate(comments)
end

trap('INT') { server.shutdown }

server.start
