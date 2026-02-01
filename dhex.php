<?php
session_start();
require_once "core/core.php";

$page = $_GET['page'] ?? 'home';
$sys = __DIR__ . "/core/pages/";

$path = trim($_SERVER['REQUEST_URI'], '/');
$parts = explode('/', $path);

$path2 = $parts[2] ?? []; 
$path3 = $parts[3] ?? [];
$searchs = urldecode($parts[2] ?? '');

if(empty($parts['2'])){
    $path2 = "";
}

if(empty($parts['3'])){
    $path3 = "";
}

if(dhex('app_url') == null){
    $root = "/";
}
else{
    $root = "/" . dhex("app_url") . "/";
}


switch ($page) {
    case "home":
        include $sys . "main.php";
        break;

    case "anime/$path2":
        include $sys . "anime.php";
        break;
    case "notfound/$path2":
        include $sys . "notfound.php";
        break;

    case "streaming/$path2/$path3":
        include $sys . "streaming.php";
        break;
        
    case "watch/$path2/$path3":
        include $sys . "watch.php";
        break;

    case "schedule":
        include $sys . "schedule.php";
        break;

    case "genre":
        include $sys . "genre.php";
        break;

    case "genre/$path2/$path3":
        include $sys . "streamgenre.php";
        break;

    case "search/$searchs":
        include $sys . "search.php";
        break;

    case "logout":
        session_unset();
        session_destroy();
        header("Location:$root");
        break;

    default:
        http_response_code(404);
        echo "Error: Failed to open stream. No such file or directory $page";
        break;
}
