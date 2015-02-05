<?php
if(isset($_SERVER['argv'][0]) && $_SERVER['argv'][0] === 'server.php') {
    exec('php -S localhost:3000 -t public server.php');
}

$comments = file_get_contents('_comments.json');
switch($_SERVER["REQUEST_URI"]) {
    case '/':
        echo file_get_contents('./public/index.html');
        break;
    case '/comments.json':
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $commentsDecoded = json_decode($comments, true);
            $commentsDecoded[] = ['author'  => $_POST['author'], 
                                  'text'    => $_POST['text']];

            $comments = json_encode($commentsDecoded);
            file_put_contents('_comments.json', $comments);
        } 
        header('Content-Type: application/json');
        echo $comments;
        break;
    default:
        return false;
}
