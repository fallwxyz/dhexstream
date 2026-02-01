<?php 
    if(empty($parts[3]) OR $parts[3] == null){
        $page = "?page=1";
    }
    else{
        $page = "?page=" . $parts[3];
    }
    $slug = "genre/" . $parts[2] . $page;
    $raw = get($slug);
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DHEX Stream</title>
    <link href="https://cdn.jsdelivr.net/npm/daisyui@5" rel="stylesheet" type="text/css" />
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <script src="https://kit.fontawesome.com/cc8eb8fa05.js" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="../../assets/styles/main.css">
    <link rel="stylesheet" href="../../assets/styles/animation.css">
    <link rel="stylesheet" href="../../assets/styles/component.css">
</head>
<style>
    .navy{
        margin-top: 10px;
        width: 100%;
        display: flex;
        justify-content: center;
        gap: 20px;
    }
    .navy a{
        display: flex;
        gap: 5px;
        padding: 3px 10px;
        border-radius: 5px;
        color: #000000;
        background: #fff;
        font-weight: 600;
        font-size: 15px;
        align-items: center;
    }
</style>
<body>
    <?php 
    include "navbar.php";
    ?>

    <main style="gap: 20px;">
        <div class="ongoing">
            <div class="header">
                <p>Genre: <?= $parts[2] ?></p>
                <a>Halaman: <?= $raw['pagination']['currentPage'] ?></a>
            </div>
            <div class="home-list">
                <?php 
                foreach($raw['data']['animeList'] as $row){
                ?>
                <a href="<?= $root ?>anime/<?= $row['animeId'] ?>" class="data">
                    <img src="<?= $row['poster'] ?>">
                    <div class="text">
                        <p id="date" style="display:flex;justify-content:space-between;"><span><?= $row['season'] ?></span><span><?= $row['episodes'] ?> Eps</span></p>
                        <p id="name"><?= $row['title'] ?></p>
                    </div>
                </a>
                <?php
                }
                ?>
            </div>
            <div class="navy">
                <?php 
                if($raw['pagination']['hasPrevPage'] == false){
                    $prevPage = "";
                    $prevBtn = "style='cursor:not-allowed;'";
                }
                else{
                    $prevPage = "href='$root" . "genre/" . $parts[2] . "/" . $raw['pagination']['prevPage'] . "'";
                    $prevBtn = "";
                }
                
                if($raw['pagination']['hasNextPage'] == false){
                    $nextPage = "";
                    $nextBtn = "style='cursor:not-allowed;'";
                }
                else{
                    $nextPage = "href='$root" . "genre/" . $parts[2] . "/" . $raw['pagination']['nextPage'] . "'";
                    $nextBtn = "";
                }
                ?>
                <a <?= $prevPage ?> <?= $prevBtn ?>><i class="fa-solid fa-arrow-left"></i>Prev</a>

                <a <?= $nextPage ?> <?= $nextBtn ?>>Next<i class="fa-solid fa-arrow-right"></i></a>
            </div>
        </div>
    </main>

    <footer class="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4">
        <aside>
            <p>Copyright © 2026 - All right reserved by MainDHEX</p>
        </aside>
    </footer>
</body>

</html>