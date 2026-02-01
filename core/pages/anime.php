<?php 
    $raw = get("anime/" . $parts[2]);
    // $raw = get("data/home.json");
    $data = $raw['data'];
    
    if(empty($data) OR $data == null){
        header("Location: $root" . "notfound/" . $parts[2]);
    }
    $eps  = $raw['data']['episodeList'];
    $gnr  = $raw['data']['genreList'];
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
    <link rel="stylesheet" href="../assets/styles/main.css">
    <link rel="stylesheet" href="../assets/styles/animation.css">
    <link rel="stylesheet" href="../assets/styles/component.css">
</head>

<body>
    <?php 
    include "navbar.php";
    ?>

    <main style="gap: 20px;">
        <div class="ongoing" style="max-width: 800px;">
            <div class="header">
                <p><?= $data['title'] ?></p>
                <!-- <a href="">Anime Lainnya <i class="fa-solid fa-arrow-right"></i></a> -->
            </div>
            <div class="detail">
                <img src="<?= $data['poster'] ?>" alt="">
                <div class="data">
                    <label>
                        <p>Judul</p>
                        <p>: <?= $data['title'] ?></p>
                    </label>

                    <label>
                        <p>Japanese</p>
                        <p>: <?= $data['japanese'] ?></p>
                    </label>

                    <label>
                        <p>Skor</p>
                        <p>: <?= $data['score'] ?></p>
                    </label>

                    <label>
                        <p>Produser</p>
                        <p>: <?= $data['producers'] ?></p>
                    </label>

                    <label>
                        <p>Tipe</p>
                        <p>: <?= $data['type'] ?></p>
                    </label>

                    <label>
                        <p>Status</p>
                        <p>: <?= $data['status'] ?></p>
                    </label>

                    <label>
                        <p>Total Episode</p>
                        <p>: <?= $data['episodes'] ?></p>
                    </label>

                    <label>
                        <p>Durasi</p>
                        <p>: <?= $data['duration'] ?></p>
                    </label>

                    <label>
                        <p>Tanggal Rilis</p>
                        <p>: <?= $data['aired'] ?></p>
                    </label>

                    <label>
                        <p>Studio</p>
                        <p>: <?= $data['studios'] ?></p>
                    </label>

                    <label>
                        <p>Gendre</p>
                        <p>: 
                        <?php 
                        foreach($gnr as $row){
                            echo $row['title'] . ", ";
                        }
                        ?>
                        </p>
                    </label>

                </div>
            </div>
            <div class="overflow-x-auto rounded-box border border-base-content/5">
                <table class="table">
                    <tbody>
                        <?php 
                        foreach($eps as $row){
                        ?>
                        <tr>
                            <td><a href="<?= $root ?>streaming/<?= $row['episodeId'] ?>/"><?= $row['title'] ?></a></td>
                            <td align="right"><?= $row['date'] ?></td>
                        </tr>
                        <?php
                        }
                        ?>
                    </tbody>
                </table>
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