<?php
session_start();
require_once "core/core.php";

$page = $_GET['page'] ?? 'home';

// API requests should be handled by api.php, but if they come here for some reason:
if ($page === 'api') {
    include 'api.php';
    exit;
}

// For all other routes, serve the React Frontend
// We need to serve the index.html from the root (or where Vite outputs it if we were in prod, 
// but for dev we use the root index.html and Vite dev server logic via proxy, 
// OR simpler: we just serve the HTML and let the client side routing take over).

// In production, you would serve the built index.html.
// In this dev setup, we might want to just output the HTML that points to Vite.

// However, since the user is likely running `npm run dev` separately, 
// they might access `localhost:3000`. 
// If they access via Apache `localhost/dhexstream/`, we want to serve the app.

// Let's assume for now we are in DEV mode and we want to allow the PHP router 
// to mostly just return the HTML shell that loads the React app.

?>
<!doctype html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/x-icon" href="/dhexstream/public/image/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DHEX Stream</title>

    <!-- IF we are in dev mode, we need to point to the Vite server -->
    <!-- But since we are inside Apache, that's tricky without a proxy setup in Apache. -->

    <!-- Strategy: We will assume the user will run `npm run build` and we serve the dist, 
         OR we assume the user will access via port 3000 for development. -->

    <!-- For seamless integration, let's output the content of index.html 
         but we need to make sure paths are correct. -->

    <!-- If we are just serving the built assets from assets/dist: -->
    <?php
    $manifestPath = __DIR__ . '/assets/dist/.vite/manifest.json';
    if (file_exists($manifestPath)) {
        $manifest = json_decode(file_get_contents($manifestPath), true);
        $entry = $manifest['src/main.jsx'];
        $ts = time(); // Cache busting
        echo '<script type="module" src="/dhexstream/assets/dist/' . $entry['file'] . '?v=' . $ts . '"></script>';
        if (isset($entry['css'])) {
            foreach ($entry['css'] as $css) {
                echo '<link rel="stylesheet" href="/dhexstream/assets/dist/' . $css . '?v=' . $ts . '">';
            }
        }
    } else {
        // Fallback for Dev Mode if they access via Apache but haven't built yet?
        // Ideally they should use localhost:3000 for dev.
        // Let's just point to localhost:3000 for the script if we can, or just tell them.
        echo '<script type="module" src="http://localhost:5173/src/main.jsx"></script>';
        echo '<script type="module">
        import RefreshRuntime from "http://localhost:5173/@react-refresh"
        RefreshRuntime.injectIntoGlobalHook(window)
        window.$RefreshReg$ = () => {}
        window.$RefreshSig$ = () => (type) => type
        window.__vite_plugin_react_preamble_installed__ = true
        </script>';
    }
    ?>
</head>

<body>
    <div id="root"></div>
</body>

</html>