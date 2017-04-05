<?php
/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
$scriptInvokedFromCli =
    isset($_SERVER['argv'][0]) && $_SERVER['argv'][0] === 'server.php';

if($scriptInvokedFromCli) {
    $port = getenv('PORT');
    if (empty($port)) {
        $port = "3000";
    }

    echo 'starting server on port '. $port . PHP_EOL;
    exec('php -S localhost:'. $port . ' -t public server.php');
} else {
    return routeRequest();
}

function routeRequest()
{
    $uri = $_SERVER['REQUEST_URI'];
    if ($uri == '/') {
        echo file_get_contents('./public/index.html');
    } elseif (preg_match('/\/api\/comments(\?.*)?/', $uri)) {
        $comments = file_get_contents('comments.json');
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $commentsDecoded = json_decode($comments, true);
            $commentsDecoded[] = [
                'id'      => round(microtime(true) * 1000),
                'author'  => $_POST['author'],
                'text'    => $_POST['text']
            ];

            $comments = json_encode($commentsDecoded, JSON_PRETTY_PRINT);
            file_put_contents('comments.json', $comments);
        }
        header('Content-Type: application/json');
        header('Cache-Control: no-cache');
        header('Access-Control-Allow-Origin: *');
        echo $comments;
    } else {
        return false;
    }
}
