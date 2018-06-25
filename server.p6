# This file provided by Facebook is for non-commercial testing and evaluation
# purposes only. Facebook reserves all rights not expressly granted.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
# FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
# ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
# WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

use v6;

use Cro::HTTP::Server;
use Cro::HTTP::Router;
use JSON::Fast;

my $comments-file = 'comments.json';

my $application = route {
    get -> *@path {
        static 'public', @path, :indexes<index.html>;
    }
    get -> 'api', 'comments' {
        cache-control :no-cache;
        static $comments-file;
        response.append-header('Access-Control-Allow-Origin', '*');
    }
    post -> 'api', 'comments' {
        request-body -> (:$id, :$author, :$text) {
            my $comments = from-json $comments-file.IO.slurp;
            $id ||= (now * 10 ** 7).Int;
            $comments.push: { :$id, :$author, :$text };
            $comments-file.IO.open(:w).print(to-json $comments);
            cache-control :no-cache;
            response.append-header('Access-Control-Allow-Origin', '*');
            content 'application/json', $comments;
        }
    }
}

my $port = %*ENV<PORT> || 3000;
my Cro::Service $hello = Cro::HTTP::Server.new:
    :host<localhost>, :$port, :$application;
$hello.start;
react whenever signal(SIGINT) { $hello.stop; exit; }
