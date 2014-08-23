require 'webrick'
require 'json'

comments = react_version = JSON.parse(File.read('./_comments.json'))

puts 'Server started: http://localhost:3000/'

root = File.expand_path './public'
server = WEBrick::HTTPServer.new :Port => 3000, :DocumentRoot => root

server.mount_proc '/comments.json' do |req, res|
  if req.request_method == 'POST'
    # Assume it's well formed
    comments << req.query
  end

  # always return json
  res['Content-Type'] = 'application/json'
  res.body = comments.to_json
end

trap 'INT' do server.shutdown end

server.start
