export const SOCIAL_LOGIN_LOGOS_URLS = {
    GOOGLE: "ui/oauth/google.png",
    VK: "/ui/oauth/vk.png"
}

export const formattedDate = (date) => {

    if (date === null || date === undefined)
        date = new Date();

    const year = String(date.getFullYear());
    let month = String(date.getMonth());
    let day = String(date.getDay());

    if(month.length === 1)
        month = "0" + month;

    if(day.length === 1)
        day = "0" + day;

    return year + "." + month + "." + day;
}