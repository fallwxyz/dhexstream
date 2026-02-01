<?php

function conf(string $key = 'Sdatabase')
{
    $type = nocaps($key);
    if ($type === 'sdatabase' || $type === 'sd') {
        return SingletonDatabase::getInstance();
    }
    return new NonSingletonDatabase();
}

function dhex($key = "all")
{
    if ($key != "all") {
        return DhexConfig::get($key);
    }
    return DhexConfig::all();
}

function nocaps(string $text): string
{
    return mb_strtolower($text, 'UTF-8');
}