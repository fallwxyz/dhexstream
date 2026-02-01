<?php 
include "assets/styles/main.php";
include "assets/styles/animation.php";
include "assets/styles/component.php";
?>
<div class="navbar bg-base-100 shadow-sm">
    <div class="navbar-start">
        <div class="dropdown">
            <div tabindex="0" role="button" class="btn btn-ghost lg:hidden hover-l-b">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 6h16M4 12h8m-8 6h16" />
                </svg>
            </div>
            <ul tabindex="-1" class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                style="gap: 5px;">
                <li><a href="<?= $root ?>home" class="hover-l-w">Beranda</a></li>
                <!-- <li><a href="<?= $root ?>list" class="hover-l-w">Anime List</a></li> -->
                <li><a href="<?= $root ?>schedule" class="hover-l-w">Jadwal Rilis</a></li>
                <li><a href="<?= $root ?>watch/ongoing/" class="hover-l-w">On Going</a></li>
                <li><a href="<?= $root ?>watch/complete/" class="hover-l-w">Completed</a></li>
                <li><a href="<?= $root ?>genre" class="hover-l-w">Genre</a></li>
            </ul>
        </div>
        <a href="<?= $root ?>" class="root btn btn-ghost text-xl hover-l-b" style="box-shadow: none;">DHEX Stream</a>
    </div>
    <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1" style="gap:10px">
            <li><a href="<?= $root ?>home" class="hover-r-w">Beranda</a></li>
            <!-- <li><a href="<?= $root ?>list" class="hover-r-w">Anime List</a></li> -->
            <li><a href="<?= $root ?>schedule" class="hover-r-w">Jadwal Rilis</a></li>
            <li><a href="<?= $root ?>watch/ongoing/" class="hover-r-w">On Going</a></li>
            <li><a href="<?= $root ?>watch/complete/" class="hover-r-w">Completed</a></li>
            <li><a href="<?= $root ?>genre" class="hover-r-w">Genre</a></li>
        </ul>
    </div>
    <div class="navbar-end">
        <form method="post">
            <input type="text" name="key">
            <button type="submit" name="search"><i class="fa-solid fa-magnifying-glass"></i></button>
        </form>
        <!-- <a href="" class="btn btn hover-l-b" style="box-shadow: none;">Logout</a> -->
    </div>
</div>

<?php
if(isset($_POST['search'])){
    $key = $_POST['key'];
    echo "<script>location.href='". $root . "search/" . $key ."'</script>";
}
?>