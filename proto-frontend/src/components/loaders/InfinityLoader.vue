<template>
    <div>
        <svg
            width="300px"
            height="200px"
            viewBox="0 0 187.3 93.7"
            preserveAspectRatio="xMidYMid meet"
            style="left: 50%; top: 50%; position: absolute; transform: translate(-50%, -50%) matrix(1, 0, 0, 1, 0, 0)"
        >
            <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:#ed1a37" />
                    <stop offset="45%" style="stop-color:#ed1a37" />
                    <stop offset="55%" style="stop-color:#021aa5" />
                    <stop offset="100%" style="stop-color:#021aa5" />
                </linearGradient>
            </defs>
            <path
                stroke="url(#gradient)"
                id="outline"
                fill="none"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-miterlimit="10"
                d="M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1 c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z"
            />
            <path
                stroke="url(#gradient)"
                id="outline-bg"
                opacity="0.05"
                fill="none"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-miterlimit="10"
                d="				M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1 c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z"
            />
        </svg>
    </div>
</template>

<script setup></script>

<style lang="scss" scoped>
$len: 242.776657104492px;
$time: 1.6s;
#outline {
    stroke-dasharray:
        $len * 0.01,
        $len;
    stroke-dashoffset: 0;
    animation: anim $time linear infinite;
}
@keyframes anim {
    12.5% {
        stroke-dasharray:
            $len * 0.14,
            $len;
        stroke-dashoffset: -$len * 0.11;
    }
    43.75% {
        stroke-dasharray:
            $len * 0.35,
            $len;
        stroke-dashoffset: -$len * 0.35;
    }
    100% {
        stroke-dasharray:
            $len * 0.01,
            $len;
        stroke-dashoffset: -$len * 0.99;
    }
}
</style>
