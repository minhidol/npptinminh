<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInitb433af26522dd184026f140934a40cb6
{
    public static $prefixLengthsPsr4 = array (
        'P' => 
        array (
            'Predis\\' => 7,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Predis\\' => 
        array (
            0 => __DIR__ . '/..' . '/predis/predis/src',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInitb433af26522dd184026f140934a40cb6::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInitb433af26522dd184026f140934a40cb6::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInitb433af26522dd184026f140934a40cb6::$classMap;

        }, null, ClassLoader::class);
    }
}
