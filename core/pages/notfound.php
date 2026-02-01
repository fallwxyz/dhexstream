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
        <div class="ongoing">
            <div class="header">
                <p>Data Error: <?= $parts[2] ?></p>
                <a href="javascript:history.back()"><i class="fa-solid fa-arrow-left"></i> Kembali</a>
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