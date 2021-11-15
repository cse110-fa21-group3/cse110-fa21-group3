export class Router{
    constructor(homePage){
        this["home"] = homePage;
    }

    addPage(pageKey, pageFunc){
        this[pageKey] = pageFunc;
    }

    navigate(key){
        let func = this[key];
        func();
    }
}