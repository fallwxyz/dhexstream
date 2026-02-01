<?php
$raw = get("episode/$parts[2]");
$data = $raw['data'];

// if (isset($_SESSION['servername'])) {
//     $wanted = [$_SESSION['servername']];
//     $filtered = array_filter($data['server']['qualities'], function ($q) use ($wanted) {
//         return in_array($q['title'] ?? '', $wanted, true);
//     });
//     $filtered = array_values($filtered);
//     $url = "";
//     foreach(array_slice($filtered[0]['serverList'], 0, 1) as $auto){
//         $url = $auto['serverId'];
//     }
//     $_SESSION['url'] = $url;
// }

if (empty($parts[3])) {
    $urlStream = $data['defaultStreamingUrl'];
} else {
    $raws = get("server/$parts[3]");
    $urlStream = $raws['data']['url'];
}

$pe = $data['prevEpisode'];
$ne = $data['nextEpisode'];

if (empty($pe)) {
    $prevBtn = "style='cursor: not-allowed;'";
    $iconP    = '<i class="fa-solid fa-ban"></i>';
    $prevUrl = "";
} else {
    $prevBtn = "";
    $iconP    = '<i class="fa-solid fa-arrow-left"></i>Prev';
    $prevUrl = "href='" . $root . "streaming/" . $pe['episodeId'] . "/'";
}

if (empty($ne)) {
    $nextBtn = "style='cursor: not-allowed;'";
    $iconN    = '<i class="fa-solid fa-ban"></i>';
    $nextUrl = "";
} else {
    $nextBtn = "";
    $iconN    = 'Next<i class="fa-solid fa-arrow-right"></i>';
    $nextUrl = "href='" . $root . "streaming/" . $ne['episodeId'] . "/'";
}

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

<body>
    <?php
    include "navbar.php";
    ?>

    <main style="gap: 20px;">
        <div class="ongoing">
            <div class="header">
                <p><?= $data['title'] ?></p>
                <!-- <a href="">Anime Lainnya <i class="fa-solid fa-arrow-right"></i></a> -->
            </div>
            <div class="video-wrap">
                <iframe
                    src="<?= $urlStream ?>"
                    allowfullscreen>
                </iframe>
                <!-- <iframe
                    src="data/0_111748793365490_1759302841922.mp4"
                    allowfullscreen>
                </iframe> -->
            </div>
            <div class="pagina">
                <form method="post" class="kiri" style="width:100%;display: flex;justify-content:space-between;">
                    <?php
                    foreach (array_slice($data['server']['qualities'], 0, 3) as $row) {
                        foreach (array_slice($row['serverList'], 0, 1) as $rows) {
                            $serverId = $rows['serverId'];
                        }
                    ?>
                        <a href='<?= $root . "streaming/" . $parts['2'] . "/" . $serverId?>'><?= $row['title'] ?></a>
                    <?php
                    }
                    ?>
                </form>
                <div class="kanan">
                    <!-- <i class="fa-solid fa-ban"></i> -->
                    <a <?= $prevUrl ?> <?= $prevBtn ?>><?= $iconP ?></a>
                    <span>PAGE</span>
                    <a <?= $nextUrl ?> <?= $nextBtn ?>><?= $iconN ?></a>
                </div>
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