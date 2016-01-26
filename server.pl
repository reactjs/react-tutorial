# This file provided by Facebook is for non-commercial testing and evaluation
# purposes only. Facebook reserves all rights not expressly granted.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
# FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
# ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
# WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

use Time::HiRes qw(gettimeofday);
use Mojolicious::Lite;
use Mojo::JSON qw(encode_json decode_json);

app->static->paths->[0] = './public';

any '/' => sub { $_[0]->reply->static('index.html') };

any [qw(GET POST)] => '/api/comments' => sub {
  my $self = shift;
  my $comments = decode_json (do { local(@ARGV,$/) = 'comments.json';<> });
  $self->res->headers->cache_control('no-cache');
  $self->res->headers->access_control_allow_origin('*');

  if ($self->req->method eq 'POST')
  {
    push @$comments, {
      id     => int(gettimeofday * 1000),
      author => $self->param('author'),
      text   => $self->param('text'),
    };
    open my $FILE, '>', 'comments.json';
    print $FILE encode_json($comments);
  }
  $self->render(json => $comments);
};
my $port = $ENV{PORT} || 3000;
app->start('daemon', '-l', "http://*:$port");
