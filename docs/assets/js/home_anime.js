anime
    .timeline()
    .add({
        targets: '#slash',
        easing: 'easeOutExpo',
        translateX: -850,
        translateY: 450,
        scale: 2,
        opacity: 0,
        duration: 1
    })
    .add({
        targets: '#logo',
        scale: [0, 1],
        easing: 'easeOutExpo',
        duration: 400,
        offset: 200
    })
    .add({
        targets: '#logo #logo-default path',
        opacity: [0, 1],
        easing: 'easeOutExpo',
        duration: 300,
        offset: 200,
        delay: function(el, i) {
            return 80 * i;
        }
    })
    .add({
        targets: '#slash',
        translateX: -407.5,
        translateY: -15,
        easing: 'easeOutElastic(1, .6)',
        opacity: 0.5,
        duration: 500
    })
    .add({
        targets: '#separated_lastE',
        translateX: 1225,
        easing: 'easeOutExpo',
        duration: 1250
    })
    .add({
        targets: '#slash',
        easing: 'easeOutExpo',
        opacity: 1,
        duration: 1000
    })
document.getElementById("logo").addEventListener("click", () => {
    anime.timeline()
        .add({
            targets: '#about_me',
            scale: [
                {value: .1, easing: 'easeOutSine', duration: 500},
                {value: 1, easing: 'easeInOutQuad', duration: 1200}
            ],
            delay: anime.stagger(0, {grid: [14, 5], from: 'center'})
        })
})