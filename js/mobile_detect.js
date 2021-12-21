export var isMobile = false;
// var filter = "hp-ux|linux i686|linux armv7l|mac68k|macppc|macintel|sunos|win16|win32|wince";
var toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];
    
isMobile = toMatch.some((toMatchItem) => {
    return navigator.userAgent.match(toMatchItem);
});
console.log(isMobile);