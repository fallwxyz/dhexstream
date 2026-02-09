<?php
header('Content-Type: application/json');
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . "/core/core.php";

$endpoint = $_GET['endpoint'] ?? '';
$id = $_GET['id'] ?? '';
$page = $_GET['page'] ?? 1;

$userId = getRecentUserId();
// Use /tmp for recent.json to avoid read-only errors on Vercel
$file = sys_get_temp_dir() . '/recent.json';
// $json loading moved to specific cases for performance


try {
    switch ($endpoint) {
        case 'home':
            $data = get("home");
            echo json_encode($data);
            break;

        case 'get_recent':
            $json = loadRecentJson($file);
            $recent = getUserRecent($json, $userId);
            echo json_encode(['status' => 'success', 'data' => $recent]);
            break;

        case 'popular':
            echo json_encode(getPopularAnime($page));
            break;

        case 'top_rated':
            echo json_encode(getTopRatedAnime($page));
            break;


        case 'anime':
            if (empty($id)) {
                http_response_code(400);
                echo json_encode(['error' => 'Anime ID required']);
            } else {
                $data = get("anime/$id");
                echo json_encode($data);
            }
            break;

        case 'episode':
            // In the React app, we pass 'ep' as the episodeId
            $ep = $_GET['ep'] ?? '';
            if (empty($ep)) {
                http_response_code(400);
                echo json_encode(['error' => 'Episode ID required']);
            } else {
                // Legacy streaming.php: get("episode/$parts[2]") 
                $data = get("episode/$ep");
                echo json_encode($data);
            }
            if ($data && isset($data['data'])) {
                // Implicit logging removed to favor explicit client-side logging via log_recent
                // This prevents double-logging and reduces server-side processing time
            }

            break;

        case 'schedule':
            $data = get("schedule");
            echo json_encode($data);
            break;

        case 'ongoing':
            $pageParam = $page > 1 ? "?page=$page" : "";
            $data = get("ongoing-anime" . $pageParam);
            echo json_encode($data);
            break;

        case 'complete':
            $pageParam = $page > 1 ? "?page=$page" : "";
            $data = get("complete-anime" . $pageParam);
            echo json_encode($data);
            break;

        case 'server':
            $server_id = $_GET['server_id'] ?? '';
            if (empty($server_id)) {
                http_response_code(400);
                echo json_encode(['error' => 'Server ID required']);
            } else {
                // Legacy streaming.php: get("server/$parts[3]")
                $data = get("server/$server_id");
                echo json_encode($data);
            }
            break;

        case 'search':
            $query = $_GET['query'] ?? '';
            if (empty($query)) {
                http_response_code(400);
                echo json_encode(['error' => 'Query required']);
            } else {
                $data = get("search/$query?page=$page");
                echo json_encode($data);
            }
            break;

        case 'genre':
            $id = $_GET['id'] ?? '';
            $page = $_GET['page'] ?? 1;

            if (empty($id)) {
                // Return list of genres from local file
                $jsonPath = __DIR__ . '/data/genre.json';
                if (file_exists($jsonPath)) {
                    $jsonContent = file_get_contents($jsonPath);
                    $data = json_decode($jsonContent, true);
                    echo json_encode($data);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => 'Genre data file not found']);
                }
            } else {
                // Return anime list for specific genre
                // mimic streamgenre.php: get("genre/$parts[2]$page")
                $pageParam = $page > 1 ? "?page=$page" : "";
                $data = get("genre/$id" . $pageParam);
                echo json_encode($data);
            }
            break;

        case 'log_recent':
            // Get data from POST or GET
            $input = json_decode(file_get_contents('php://input'), true);

            $animeId = $input['animeId'] ?? $_GET['animeId'] ?? '';
            $title = $input['title'] ?? $_GET['title'] ?? '';
            $poster = $input['poster'] ?? $_GET['poster'] ?? '';
            $href = $input['href'] ?? $_GET['href'] ?? '';

            // Default values for robustness
            $animeId = !empty($animeId) ? $animeId : ($href ? explode('/', $href)[0] : ''); // Try to extract ID from href if missing
            $title = !empty($title) ? $title : 'Unknown Anime';
            $poster = !empty($poster) ? $poster : '/dhexstream/assets/image/default-poster.jpg';

            // Debug logging
            file_put_contents('debug_log.txt', date('[Y-m-d H:i:s] ') . "Processing log_recent: ID=$animeId, Title=$title\n", FILE_APPEND);

            if (empty($animeId)) {
                file_put_contents('debug_log.txt', date('[Y-m-d H:i:s] ') . "Error: Missing animeId\n", FILE_APPEND);
                http_response_code(400);
                echo json_encode(['error' => 'Missing required field: animeId']);
            } else {
                $json = loadRecentJson($file);
                // If href is missing, generate default
                if (empty($href)) {
                    $href = "$animeId";
                }

                // Strip leading slash to prevent double slash in URLs
                $href = ltrim($href, '/');

                $newRecent = [
                    "title" => $title,
                    "animeId" => $animeId,
                    "poster" => $poster,
                    "href" => $href,
                    "currentTime" => $input['currentTime'] ?? $_GET['currentTime'] ?? 0,
                    "duration" => $input['duration'] ?? $_GET['duration'] ?? 0,
                    "time" => "baru saja"
                ];

                // Add to recent list
                addRecent($json, $userId, $newRecent, 50);

                // Extra cleaning: remove duplicates based on animeId, keeping the latest one
                // And filter out any "undefined" animeIds that might have snuck in
                cleanDuplicates($json, $userId);

                cleanExpiredUsers($json, 7, 'hari');
                saveRecentJson($file, $json);

                echo json_encode(['status' => 'success', 'data' => $newRecent]);
            }
            break;

        default:
            http_response_code(404);
            echo json_encode(['error' => 'Endpoint not found']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

function cleanDuplicates(&$json, $userId)
{
    foreach ($json['data'] as &$user) {
        if ($user['id'] == $userId) {
            $uniqueRecent = [];
            $seenIds = [];

            // Iterate through existing recent list
            foreach ($user['recent'] as $item) {
                // Ensure item is an array and has animeId
                if (!is_array($item) || !isset($item['animeId']))
                    continue;

                $id = $item['animeId'];

                // Skip invalid IDs
                if (empty($id) || $id === 'undefined') {
                    continue;
                }

                // If we haven't seen this ID yet, add it
                // Since addRecent adds to the TOP (unshift), the first one we see is the latest
                if (!in_array($id, $seenIds)) {
                    $uniqueRecent[] = $item;
                    $seenIds[] = $id;
                }
            }

            // Re-index array
            $user['recent'] = array_values($uniqueRecent);
            break;
        }
    }
}
