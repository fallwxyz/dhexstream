# 🐛 DHEXStream Common Troubleshooting

A quick guide to solving the most common issues after deploying.

| Symptom | Probable Cause | Fix |
|---|---|---|
| **White Screen (Blank Page)** | Frontend build paths/base URL incorrect | 1. Check `vite.config.js` `base`<br>2. Check `dist/index.html` referencing `/assets/`<br>3. Check browser console |
| **404 on Refresh** | Missing `.htaccess` rewrite rules | Ensure `.htaccess` exists in root and has `RewriteRule ^(.*)$ dhex.php?page=$1` |
| **API Error / No Data** | API endpoint unreachable | 1. Check `.dhex` `app_url`<br>2. Check file permissions (755)<br>3. Check PHP version (7.4+) |
| **Images Not Loading** | Incorrect asset paths | Check `assets/image` folder uploaded & accessible |
| **Error 500** | Server misconfiguration | 1. Check `.htaccess` syntax<br>2. Check error_log file<br>3. Permissions issue (755/644) |
| **CORS Error** | Cross-Origin conflict (rare on same domain) | Check `.dhex` allowed origins or add headers in `index.php` |

## Advanced Checks

### check_status.php
Create a `check.php` file in your root to verify environment:

```php
<?php
echo "PHP Version: " . phpversion() . "<br>";
echo "Mod Rewrite: " . (in_array('mod_rewrite', apache_get_modules()) ? 'On' : 'Off') . "<br>";
echo "Write Permission: " . (is_writable('api/data') ? 'Yes' : 'No') . "<br>";
?>
```

Access `domain.com/check.php` to verify. **Delete after use!**

### Logs
Check `error_log` in your cPanel file manager. It contains detailed PHP errors.
