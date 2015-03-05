<?php
$scriptInvokedFromCli =
    isset($_SERVER['argv'][0]) && $_SERVER['argv'][0] === 'server.php';

if($scriptInvokedFromCli) {
    echo 'starting server on port 3000' . PHP_EOL;
    exec('php -S localhost:3000 -t public server.php');
} else {
    return routeRequest();
}

function routeRequest()
{
    $comments = file_get_contents('comments.json');
    switch($_SERVER["REQUEST_URI"]) {
        case '/':
            echo file_get_contents('./public/index.html');
            break;
        case '/comments.json':
            if($_SERVER['REQUEST_METHOD'] === 'POST') {
                $commentsDecoded = json_decode($comments, true);
                $commentsDecoded[] = ['author'  => $_POST['author'],
                                      'text'    => $_POST['text']];

                $comments = json_encode($commentsDecoded, JSON_PRETTY_PRINT);
                file_put_contents('comments.json', $comments);
            }
            header('Content-Type: application/json');
            header('Cache-Control: no-cache');
            echo $comments;
            break;
        default:
            return false;
    }
}

