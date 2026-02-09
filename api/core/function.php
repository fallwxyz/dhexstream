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
            if (str_starts_with(trim($line), '#'))
                continue;

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
    $now = time();

    if (!file_exists($file)) {
        file_put_contents($file, json_encode([]));
    }

    $raw = file_get_contents($file);
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
    $cacheDir = __DIR__ . '/cache/';
    if (!is_dir($cacheDir)) {
        mkdir($cacheDir, 0777, true);
    }

    $cacheFile = $cacheDir . md5($url) . '.json';
    $cacheDuration = 900; // Default 15 minutes

    // Determine cache duration based on endpoint
    if (str_contains($url, 'home') || str_contains($url, 'ongoing')) {
        $cacheDuration = 600; // 10 minutes
    } elseif (str_contains($url, 'schedule')) {
        $cacheDuration = 21600; // 6 hours
    } elseif (str_contains($url, 'anime/')) {
        $cacheDuration = 3600; // 1 hour
    } elseif (str_contains($url, 'search')) {
        $cacheDuration = 3600; // 1 hour
    } elseif (str_contains($url, 'complete')) {
        $cacheDuration = 86400; // 24 hours
    }

    // Check if cache exists and is valid
    if (file_exists($cacheFile) && (time() - filemtime($cacheFile) < $cacheDuration)) {
        $cachedData = file_get_contents($cacheFile);
        $decoded = json_decode($cachedData, true);
        if ($decoded) {
            return $decoded;
        }
    }

    // Rate limit check only before external request
    if (!rateLimit(60, 60)) {
        // If rate limited but we have stale cache, return it?
        if (file_exists($cacheFile)) {
            $cachedData = file_get_contents($cacheFile);
            return json_decode($cachedData, true);
        }
        die(json_encode(['error' => 'Too many requests, please try again later.']));
    }

    // Use curl for better performance and timeout handling
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://www.sankavollerei.com/anime/" . $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10); // 10 seconds timeout
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    // Add user agent to avoid being blocked
    curl_setopt($ch, CURLOPT_USERAGENT, 'DhexStream/1.0');

    $data = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200 && $data) {
        // Save to cache
        file_put_contents($cacheFile, $data);
        return json_decode($data, true);
    }

    // If request failed but we have stale cache, return it
    if (file_exists($cacheFile)) {
        $cachedData = file_get_contents($cacheFile);
        return json_decode($cachedData, true);
    }

    return null; // Or handle error appropriately
}

function get_raw($url)
{
    $cacheDir = __DIR__ . '/cache/';
    if (!is_dir($cacheDir)) {
        mkdir($cacheDir, 0777, true);
    }

    $cacheFile = $cacheDir . md5($url) . '.html';
    $cacheDuration = 3600; // 1 hour for scraped data

    if (file_exists($cacheFile) && (time() - filemtime($cacheFile) < $cacheDuration)) {
        return file_get_contents($cacheFile);
    }

    if (!rateLimit(60, 60)) {
        if (file_exists($cacheFile)) {
            return file_get_contents($cacheFile);
        }
        return null;
    }

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    $data = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200 && $data) {
        file_put_contents($cacheFile, $data);
        return $data;
    }

    if (file_exists($cacheFile)) {
        return file_get_contents($cacheFile);
    }

    return null;
}

function scrapeOtakuAnime($html)
{
    $results = [];
    if (!$html) {
        error_log("scrapeOtakuAnime: No HTML content provided.");
        return $results;
    }

    libxml_use_internal_errors(true);
    $dom = new DOMDocument();
    $dom->loadHTML($html);
    $xpath = new DOMXPath($dom);

    // Look for venz list entries
    $nodes = $xpath->query("//div[contains(@class, 'venz')]//li");

    foreach ($nodes as $node) {
        $item = [];

        // Title
        $titleNode = $xpath->query(".//h2[contains(@class, 'jdlflm')]", $node)->item(0);
        $item['title'] = $titleNode ? trim($titleNode->nodeValue) : '';

        // Poster
        $imgNode = $xpath->query(".//img", $node)->item(0);
        $item['poster'] = $imgNode ? $imgNode->getAttribute('src') : '';

        // Link and ID
        $linkNode = $xpath->query(".//a", $node)->item(0);
        if ($linkNode) {
            $href = $linkNode->getAttribute('href');
            $item['otakudesuUrl'] = $href;
            $parts = explode('/', trim($href, '/'));
            $item['animeId'] = end($parts);
            // Reconstruct relative href for frontend if needed
            $item['href'] = "/anime/anime/" . $item['animeId'];
        }

        // Score (for Top Rated)
        $scoreNode = $xpath->query(".//div[contains(@class, 'epztipe')]", $node)->item(0);
        if ($scoreNode) {
            $scoreText = trim($scoreNode->nodeValue);
            // Score usually looks like "7.50" or "Monday" (release day)
            // We'll try to extract numeric part
            if (preg_match('/[0-9]+\.[0-9]+/', $scoreText, $matches)) {
                $item['score'] = $matches[0];
            } else {
                $item['score'] = $scoreText;
            }
        }

        // Episodes or Release info
        $epNode = $xpath->query(".//div[contains(@class, 'epz')]", $node)->item(0);
        if ($epNode) {
            $epText = trim($epNode->nodeValue);
            $item['latestReleaseDate'] = $epText;
            $item['lastReleaseDate'] = $epText;
            if (preg_match('/([0-9]+)\s*Episode/', $epText, $matches)) {
                $item['episodes'] = (int) $matches[1];
            }
        }

        if (!empty($item['title']) && !empty($item['animeId'])) {
            $results[] = $item;
        }
    }

    if (empty($results)) {
        error_log("scrapeOtakuAnime: No results found in HTML.");
    }

    return $results;
}

function scrapePagination($html)
{
    $pagination = [
        "currentPage" => 1,
        "totalPages" => 1,
        "hasNextPage" => false,
        "hasPrevPage" => false
    ];

    if (!$html)
        return $pagination;

    libxml_use_internal_errors(true);
    $dom = new DOMDocument();
    $dom->loadHTML($html);
    $xpath = new DOMXPath($dom);

    $pageNodes = $xpath->query("//div[contains(@class, 'pagination')]//a[contains(@class, 'page-numbers')]");
    $currentNodes = $xpath->query("//div[contains(@class, 'pagination')]//span[contains(@class, 'current')]");

    if ($currentNodes->length > 0) {
        $pagination['currentPage'] = (int) trim($currentNodes->item(0)->nodeValue);
    }

    $maxPage = $pagination['currentPage'];
    foreach ($pageNodes as $node) {
        $val = trim($node->nodeValue);
        if (is_numeric($val)) {
            $maxPage = max($maxPage, (int) $val);
        }
    }
    $pagination['totalPages'] = $maxPage;
    $pagination['hasNextPage'] = $pagination['currentPage'] < $pagination['totalPages'];
    $pagination['hasPrevPage'] = $pagination['currentPage'] > 1;

    return $pagination;
}

function getPopularAnime($page = 1)
{
    $url = "https://otakudesu.best/ongoing-anime/";
    if ($page > 1) {
        $url .= "page/$page/";
    }

    $html = get_raw($url);
    $list = scrapeOtakuAnime($html);
    $pagination = scrapePagination($html);
    $pagination['totalAnime'] = count($list); // Approximate

    return [
        "status" => "success",
        "data" => [
            "animeList" => $list,
        ],
        "pagination" => $pagination
    ];
}

function getTopRatedAnime($page = 1)
{
    $url = "https://otakudesu.best/complete-anime/";
    if ($page > 1) {
        $url .= "page/$page/";
    }

    $html = get_raw($url);
    $list = scrapeOtakuAnime($html);
    $pagination = scrapePagination($html);
    $pagination['totalAnime'] = count($list); // Approximate

    // Sort by score if available
    usort($list, function ($a, $b) {
        $scoreA = isset($a['score']) && is_numeric($a['score']) ? (float) $a['score'] : 0;
        $scoreB = isset($b['score']) && is_numeric($b['score']) ? (float) $b['score'] : 0;
        return $scoreB <=> $scoreA;
    });

    return [
        "status" => "success",
        "data" => [
            "animeList" => $list,
        ],
        "pagination" => $pagination
    ];
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
function timeToSeconds(int $value, string $unit): int
{
    $unit = strtolower($unit);

    return match ($unit) {
        'detik', 'second', 'seconds' => $value,
        'menit', 'minute', 'minutes' => $value * 60,
        'jam', 'hour', 'hours' => $value * 3600,
        'hari', 'day', 'days' => $value * 86400,
        'bulan', 'month', 'months' => $value * 2592000, // 30 hari
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

    if ($expireSeconds <= 0)
        return;

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
function loadRecentJson(string $file): array
{
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
function saveRecentJson(string $file, array $data): void
{
    $fp = fopen($file, 'c+');

    if (!$fp)
        return;

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
function timeAgo(int $timestamp): string
{
    $diff = time() - $timestamp;

    if ($diff < 60)
        return 'baru saja';
    if ($diff < 3600)
        return floor($diff / 60) . ' menit lalu';
    if ($diff < 86400)
        return floor($diff / 3600) . ' jam lalu';
    if ($diff < 604800)
        return floor($diff / 86400) . ' hari lalu';

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

    $foundUser = false;
    $foundAnime = false;

    foreach ($json['data'] as &$user) {
        if ($user['id'] == $userId) {
            $foundUser = true;

            // update last active
            $user['last_active'] = $now;

            foreach ($user['recent'] as $index => &$recent) {
                if ($recent['animeId'] === $newRecent['animeId']) {

                    // update field yang boleh berubah
                    $recent['href'] = $newRecent['href'];
                    $recent['title'] = $newRecent['title'];
                    $recent['time'] = $newRecent['time'];
                    $recent['currentTime'] = $newRecent['currentTime'];
                    $recent['duration'] = $newRecent['duration'];

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
            "id" => $userId,
            "last_active" => $now,
            "recent" => [$newRecent]
        ];
    }
}




function getUserRecent(array $json, string $userId): array
{
    foreach ($json['data'] as $user) {
        if ($user['id'] == $userId) {
            return $user['recent'];
        }
    }
    return [];
}
