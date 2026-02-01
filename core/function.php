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
