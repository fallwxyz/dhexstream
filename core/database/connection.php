<?php

class SingletonDatabase extends mysqli
{
    private static ?SingletonDatabase $instance = null;

    private function __construct()
    {
        $host = 'p:' . getenv('DB_HOST'); // persistent connection
        $user = getenv('DB_USER');
        $pass = getenv('DB_PASS');
        $name = getenv('DB_NAME');
        $port = getenv('DB_PORT') ?: 3306;

        parent::__construct($host, $user, $pass, $name, $port);

        if ($this->connect_error) {
            throw new Exception('DB Connection failed: ' . $this->connect_error);
        }

        $this->set_charset('utf8mb4');
    }

    public static function getInstance(): SingletonDatabase
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    private function __clone() {}

    public function __wakeup()
    {
        throw new Exception("Cannot unserialize Database");
    }
}

class NonSingletonDatabase extends mysqli
{
    public function __construct()
    {
        parent::__construct(
            getenv('DB_HOST'),
            getenv('DB_USER'),
            getenv('DB_PASS'),
            getenv('DB_NAME'),
            getenv('DB_PORT') ?: 3306
        );
    }
}