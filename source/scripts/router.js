export class Router{
    constructor(homePage){
        this["home"] = homePage;
    }

    navigate(key){
        if(key == "home"){
            this["home"]();
        }else{
            window.location.href = "/source/recipePage.html#"+key;
        }
    }
}