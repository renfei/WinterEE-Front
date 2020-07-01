
let utils = {

};

utils.title = function (title) {
    window.document.title = title;
};

utils.toDefaultPage = function (routers, name, route, next) {
    let len = routers.length;
    let i = 0;
    let notHandle = true;
    while (i < len) {
        if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
            route.replace({
                name: routers[i].children[0].name
            });
            notHandle = false;
            next();
            break;
        }
        i++;
    }
    if (notHandle) {
        next();
    }
};

utils.formatDate = function(date) {
    const dateTime = new Date(date);
    const YY = dateTime.getFullYear();
    const MM =
        dateTime.getMonth() + 1 < 10
            ? '0' + (dateTime.getMonth() + 1)
            : dateTime.getMonth() + 1;
    const D =
        dateTime.getDate() < 10 ? '0' + dateTime.getDate() : dateTime.getDate();
    const hh =
        dateTime.getHours() < 10
            ? '0' + dateTime.getHours()
            : dateTime.getHours();
    const mm =
        dateTime.getMinutes() < 10
            ? '0' + dateTime.getMinutes()
            : dateTime.getMinutes();
    const ss =
        dateTime.getSeconds() < 10
            ? '0' + dateTime.getSeconds()
            : dateTime.getSeconds();
    return `${YY}-${MM}-${D} ${hh}:${mm}:${ss}`;
}

export default utils;