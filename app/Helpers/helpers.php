<?php

/**
 * Transform image URL to use the correct base URL for API responses.
 * Replaces localhost URLs with the APP_URL from environment.
 */
function transformImageUrl($url)
{
    if (empty($url)) {
        return $url;
    }

    // Get the APP_URL from environment
    $appUrl = config('app.url');

    // Replace common localhost patterns with APP_URL
    $patterns = [
        'http://localhost:8002',
        'http://localhost:8000',
        'http://127.0.0.1:8002',
        'http://127.0.0.1:8000',
    ];

    foreach ($patterns as $pattern) {
        if (str_starts_with($url, $pattern)) {
            return str_replace($pattern, $appUrl, $url);
        }
    }

    return $url;
}

/*
<!-- Convert the URL query into array
 brands=longines%7Ccitizen%7Cmido&case_colors=black
 to [
  "brands" => ["longines", "citizen", "mido"],
  "case_colors" => "black"
]

 -->

*/
function convertQueryToArray($query)
{
    parse_str($query, $queryArray);
    $result = [];
    foreach ($queryArray as $key => $value) {
        $result[$key] = array_map('trim', explode('|', $value));
    }
    return $result;
}
