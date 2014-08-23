# This file provided by Facebook is for non-commercial testing and evaluation purposes only.
# Facebook reserves all rights not expressly granted.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
# FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
# ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
# WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import os
import json
import cgi
from BaseHTTPServer import HTTPServer
from SimpleHTTPServer import SimpleHTTPRequestHandler

PUBLIC_PATH = "public"

comments = json.loads(open('_comments.json').read())

def sendJSON(res):
    res.send_response(200)
    res.send_header('Content-type', 'application/json')
    res.end_headers()
    res.wfile.write(json.dumps(comments))

class MyHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        root = os.getcwd()
        path = PUBLIC_PATH + path
        return os.path.join(root, path)

    def do_GET(self):
        if (self.path == "/comments.json"):
            sendJSON(self)
        else:
            SimpleHTTPRequestHandler.do_GET(self)

    def do_POST(self):
        if (self.path == "/comments.json"):
            form = cgi.FieldStorage(
                fp=self.rfile,
                headers=self.headers,
                environ={'REQUEST_METHOD':'POST',
                         'CONTENT_TYPE':self.headers['Content-Type']}
            )

            # Save the data
            comments.append({u"author": form.getfirst("author"), u"text": form.getfirst("text")})
            sendJSON(self)
        else:
            SimpleHTTPRequestHandler.do_POST(self)

if __name__ == '__main__':
    print "Server started: http://localhost:3000/"
    httpd = HTTPServer(('127.0.0.1', 3000), MyHandler)
    httpd.serve_forever()
