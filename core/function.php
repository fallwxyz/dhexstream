<?php
final class DhexConfig
{
    private static array $config = [];
    private static bool $loaded = false;

    public static function load(string $path = '.dhex'): void
    {
        if (self::$loaded) {
            return;
        }

        $default = <<<DHEX
app_url=dhexframe
hostname=localhost
username=root
password=
database=
DHEX;

        if (!file_exists($path)) {
            file_put_contents($path, $default);
        }

        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

        foreach ($lines as $line) {
            if (str_starts_with(trim($line), '#')) continue;

            [$key, $value] = array_pad(explode('=', $line, 2), 2, '');
            self::$config[trim($key)] = trim($value);
        }

        self::$loaded = true;
    }

    public static function get(string $key, mixed $default = null): mixed
    {
        return self::$config[$key] ?? $default;
    }

    public static function all(): array
    {
        return self::$config;
    }
}
if (!function_exists('loadDhex')) {
    function loadDhex($path)
    {
        if (!file_exists($path)) {
            return;
        }

        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

        foreach ($lines as $line) {
            $line = trim($line);

            if ($line === '' || str_starts_with($line, '#')) {
                continue;
            }

            [$key, $value] = explode('=', $line, 2);

            $key = trim($key);
            $value = trim($value);

            putenv("$key=$value");
            $_ENV[$key] = $value;
            $_SERVER[$key] = $value;
        }
    }
}

function rateLimit(int $limit = 50, int $interval = 60): bool
{
    $file = __DIR__ . '/../data/rate_limit.json';
    $now  = time();

    if (!file_exists($file)) {
        file_put_contents($file, json_encode([]));
    }

    $raw  = file_get_contents($file);
    $data = json_decode($raw, true);

    // 🔥 FIX UTAMA
    if (!is_array($data)) {
        $data = [];
    }

    // buang request lama
    $data = array_filter($data, function ($t) use ($now, $interval) {
        return $t > ($now - $interval);
    });

    if (count($data) >= $limit) {
        return false;
    }

    $data[] = $now;
    file_put_contents($file, json_encode(array_values($data)), LOCK_EX);

    return true;
}


function get($url)
{
    if (!rateLimit(60, 60)) {
        die('Too many requests!');
    }

    $data = file_get_contents("https://www.sankavollerei.com/anime/" . $url);
    return json_decode($data, true);
}

function slug($url, $num = 1)
{
    $path = trim(parse_url($url, PHP_URL_PATH), '/');
    $parts = explode('/', $path);

    return $parts[count($parts) - $num];        // slash terakhir
}

function parse($index)
{
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $segments = array_values(
        array_filter(
            explode('/', $uri)
        )
    );

    return $segments[$index] ?? null;
}
function timeToSeconds(int $value, string $unit): int {
    $unit = strtolower($unit);

    return match ($unit) {
        'detik', 'second', 'seconds' => $value,
        'menit', 'minute', 'minutes' => $value * 60,
        'jam',   'hour',   'hours'   => $value * 3600,
        'hari',  'day',    'days'    => $value * 86400,
        'bulan', 'month',  'months'  => $value * 2592000, // 30 hari
        default => 0
    };
}

function cleanExpiredUsers(
    array &$json,
    int $value,
    string $unit
): void {
    $expireSeconds = timeToSeconds($value, $unit);
    $now = time();

    if ($expireSeconds <= 0) return;

    $json['data'] = array_values(array_filter(
        $json['data'],
        function ($user) use ($now, $expireSeconds) {
            return isset($user['last_active'])
                && ($now - $user['last_active']) <= $expireSeconds;
        }
    ));
}



function getRecentUserId(
    string $cookieName = 'recent_user_id',
    int $days = 30
): string {
    if (!isset($_COOKIE[$cookieName])) {
        $userId = time() . random_int(1000, 9999);

        setcookie(
            $cookieName,
            $userId,
            time() + (86400 * $days),
            "/",
            "",
            false,
            true
        );

        $_COOKIE[$cookieName] = $userId;
        return $userId;
    }

    return $_COOKIE[$cookieName];
}
function loadRecentJson(string $file): array {
    if (!file_exists($file)) {
        file_put_contents(
            $file,
            json_encode(["data" => []], JSON_PRETTY_PRINT)
        );
    }

    $content = file_get_contents($file);
    $json = json_decode($content, true);

    return is_array($json) ? $json : ["data" => []];
}
function saveRecentJson(string $file, array $data): void {
    $fp = fopen($file, 'c+');

    if (!$fp) return;

    flock($fp, LOCK_EX);
    ftruncate($fp, 0);
    fwrite(
        $fp,
        json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
    );
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);
}
function timeAgo(int $timestamp): string {
    $diff = time() - $timestamp;

    if ($diff < 60) return 'baru saja';
    if ($diff < 3600) return floor($diff / 60) . ' menit lalu';
    if ($diff < 86400) return floor($diff / 3600) . ' jam lalu';
    if ($diff < 604800) return floor($diff / 86400) . ' hari lalu';

    return date('d M Y', $timestamp);
}
function addRecent(
    array &$json,
    string $userId,
    array $newRecent,
    int $limit = 6
): void {
    $now = time();
    $newRecent['time'] = timeAgo($now);

    $foundUser  = false;
    $foundAnime = false;

    foreach ($json['data'] as &$user) {
        if ($user['id'] == $userId) {
            $foundUser = true;

            // update last active
            $user['last_active'] = $now;

            foreach ($user['recent'] as $index => &$recent) {
                if ($recent['animeId'] === $newRecent['animeId']) {

                    // update field yang boleh berubah
                    $recent['href']  = $newRecent['href'];
                    $recent['title'] = $newRecent['title'];
                    $recent['time']  = $newRecent['time'];

                    // pindah ke paling depan
                    unset($user['recent'][$index]);
                    array_unshift($user['recent'], $recent);

                    $foundAnime = true;
                    break;
                }
            }

            unset($recent);

            // animeId belum ada
            if (!$foundAnime) {
                array_unshift($user['recent'], $newRecent);
            }

            // limit 6
            if (count($user['recent']) > $limit) {
                $user['recent'] = array_slice($user['recent'], 0, $limit);
            }

            break;
        }
    }

    unset($user);

    // user baru
    if (!$foundUser) {
        $json['data'][] = [
            "id"          => $userId,
            "last_active" => $now,
            "recent"      => [$newRecent]
        ];
    }
}




function getUserRecent(array $json, string $userId): array {
    foreach ($json['data'] as $user) {
        if ($user['id'] == $userId) {
            return $user['recent'];
        }
    }
    return [];
}
