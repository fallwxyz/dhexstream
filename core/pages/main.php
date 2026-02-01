<?php 
    $raw = get("home");
    // $raw = get("data/home.json");
    $ongoing = array_slice($raw['data']['ongoing']['animeList'], 0, 12);
    $completed = array_slice($raw['data']['completed']['animeList'], 0, 12);
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
    <link rel="stylesheet" href="assets/styles/main.css">
    <link rel="stylesheet" href="assets/styles/animation.css">
    <link rel="stylesheet" href="assets/styles/component.css">
</head>

<body>
    <?php 
    include "navbar.php";
    if(isset($_POST['search'])){
        
    }
    ?>

    <main style="gap: 20px;">
        <div class="ongoing">
            <div class="header">
                <p>On Going Anime</p>
                <a href="<?= $root ?>watch/ongoing/">Anime Lainnya <i class="fa-solid fa-arrow-right"></i></a>
            </div>
            <div class="home-list">
                <?php 
                foreach($ongoing as $row){
                ?>
                <a href="anime/<?= $row['animeId'] ?>" class="data">
                    <img src="<?= $row['poster'] ?>">
                    <div class="text">
                        <p id="date"><?= $row['latestReleaseDate'] ?></p>
                        <p id="name"><?= $row['title'] ?></p>
                    </div>
                </a>
                <?php
                }
                ?>
            </div>
        </div>
        <div class="ongoing">
            <div class="header">
                <p>Completed Anime</p>
                <a href="<?= $root ?>watch/completed/">Anime Lainnya <i class="fa-solid fa-arrow-right"></i></a>
            </div>
            <div class="home-list">
                <?php 
                foreach($completed as $row){
                ?>
                <a href="anime/<?= $row['animeId'] ?>" class="data">
                    <img src="<?= $row['poster'] ?>">
                    <div class="text">
                        <p id="date"><?= $row['lastReleaseDate'] ?></p>
                        <p id="name"><?= $row['title'] ?></p>
                    </div>
                </a>
                <?php
                }
                ?>
            </div>
        </div>
    </main>

    <footer class="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4">
        <aside>
            <p>Copyright © 2026 - All right reserved by MainDHEX</p>
        </aside>
    </footer>
    <script src="assets/js/dateTime.js"></script>
    <script src="assets/js/autoClose.js"></script>
</body>

</html>