function themeswitch() {

    if(document.getElementById("theme-button").name === "cloudy-night-outline"){
        document.getElementById("theme-button").name = "partly-sunny-outline"

        document.documentElement.style.setProperty('--bgcolor', "black")
        document.documentElement.style.setProperty('--fontcolor', "white")

    }
    else {
        document.getElementById("theme-button").name = "cloudy-night-outline"

        document.documentElement.style.setProperty('--bgcolor', "white")
        document.documentElement.style.setProperty('--fontcolor', "black")

    }

}