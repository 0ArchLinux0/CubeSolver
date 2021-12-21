export var isMobile = false;
var filter = "hp-ux|linux i686|linux armv7l|mac68k|macppc|macintel|sunos|win16|win32|wince";
console.log(navigator.userAgentData.platform);
console.log("1111");
if (navigator.userAgentData.platform) {
    console.log("in if");
    isMobile = filter.indexOf(navigator.userAgentData.platform.toLowerCase()) < 0;
    console.log(isMobile);
}
console.log(isMobile);

/*if (isMobile) {         //prevent rotate
    window.addEventListener("orientationchange", function() { 
        if (window.matchMedia("(orientation: landscape)").matches) {
            location.replace("https://0archlinux0.github.io/minjun/");
        } else if (window.matchMedia("(orientation: portrait)").matches) {
        }

    });
}*/