import { message } from "antd";
import dayjs from "dayjs";

import logoLight from "assets/images/lightlogo.webp"
import logoColor from "assets/images/darklogo.webp"

window.appName = process.env.REACT_APP_NAME
window.api = process.env.REACT_APP_API_END_POINT
window.logoLight = logoLight
window.logoColor = logoColor
window.year = new Date().getFullYear()

window.getRandomId = () => Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
window.getRandomRef = () => Math.random().toString().slice(2, 11)
window.getValidCNIC = cnic => cnic.trim().replace(/-/gi, '').replace(/_/gi, '').replace(/ /gi, '')

// eslint-disable-next-line
window.isEmail = email => /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email)

window.timestampToDate = (date = {}, format = "DD-MM-YYYY") => {
    return date.seconds ? dayjs(date.seconds * 1000).format(format) : "";
}
window.dateFormat = (date, format = "DD-MM-YYYY") => dayjs(date).format(format)

window.today = dayjs(new Date()).format("DD-MM-YYYY")
window.month = dayjs(new Date()).format("MM-YYYY")
window.year = new Date().getFullYear()

window.onlyNumber = e => { if (!/[0-9]|Backspace|ArrowLeft|ArrowRight|Tab/.test(e.key)) { e.preventDefault() } }

window.disabledDate = (current, type) => {
    let today = dayjs().format("YYYY-MM-DD");
    // console.log("current =>", current)
    // console.log("today greaterThan =>", dayjs(today, "YYYY-MM-DD HH:mm:ss"))

    if (type === "future") { return current && current > dayjs(today, "YYYY-MM-DD"); }
    else { return current && current < dayjs(today, "YYYY-MM-DD"); }
}

// https://stackoverflow.com/questions/4060004/calculate-age-given-the-birth-date-in-the-format-yyyymmdd
window.calculateAge = (dob) => {
    let ageDifMs = Date.now() - new Date(dob).getTime();
    let ageDate = new Date(ageDifMs); // milliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

window.getDataFromHTML = (data, elementName) => {
    let html = new DOMParser().parseFromString(data, "text/xml");
    return html.getElementsByTagName(elementName)[0].innerHTML;
}

window.getSlug = (name) => {
    let slug = name?.replace(/[^a-zA-Z0-9]/g, ' ');
    slug = name.replace(/  +/g, ' ');
    slug = name.replace(/\s/g, '-').toLowerCase().replace(/[^\w-]+/g, '-');
    return slug;
}
window.getAbbreviation = (title) => {
    if (!title || typeof title !== 'string') { return '' }

    const abbreviation = title
        .split(' ') // Split the title into words
        .filter(word => word.length > 0) // Remove empty words (if any)
        .map(word => word[0].toUpperCase()) // Get the first letter and convert to uppercase
        .join(''); // Combine the letters into an abbreviation
    return abbreviation
}

window.toCapitalizeCase = text => {
    const result = text?.replace(/([A-Z])/g, " $1");
    return result?.charAt(0).toUpperCase() + result?.slice(1);
}
message.config({ maxCount: 3 })
window.toastify = (msg, type) => {
    switch (type) {
        case "success": message.success(msg); break;
        case "error": message.error(msg); break;
        case "warning": message.warning(msg); break;
        default: message.info(msg)
    }
}
window.getTagColor = (text) => {
    let color = ""
    switch (text) {
        case "active": case "applied": case "open": case "pass": case "received": color = "success"; break;
        case "closed": case "fail": case "inactive": color = "error"; break;
        case "pending": color = "warning"; break;
        default: color = "default";
    }
    return color
}


window.links = {
    phone: "tel:+923356609060",
    whatsapp: "https://api.whatsapp.com/send?phone=923356609060",
    location: "https://maps.app.goo.gl/bDW14FgXiMBPp8Bf9",
    facebook: "https://web.facebook.com/CoDevPK",
    instagram: "https://www.instagram.com/CoDevPK",
    linkedin: "https://www.linkedin.com/company/codevpk",
    youtube: "https://www.youtube.com/@UmairAhmad27/",
    github: "https://github.com/codevpk",
}

window.FormatCNIC = (value) => {
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, "");

    // Apply the CNIC format
    return digitsOnly.length >= 5
        ? `${digitsOnly.slice(0, 5)}-${digitsOnly.slice(5, 12)}-${digitsOnly.length > 12 ? digitsOnly.slice(12, 13) : ""
        }`
        : digitsOnly;
};

window.FormatPhoneNumber = (value) => {
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, "");

    // Apply the phone number format
    return digitsOnly.length >= 12
        ? `+${digitsOnly.slice(0, 2)} ${digitsOnly.slice(2, 5)} ${digitsOnly.slice(5, 12)}`
        : digitsOnly;
};

window.FormatPhoneNormal = (value) => {
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, "");

    // Apply the phone number format
    return digitsOnly.length >= 12
        ? `${digitsOnly.slice(0, 2) === '92' ? '0' : ''}${digitsOnly.slice(2, 5)} ${digitsOnly.slice(5, 12)}`
        : digitsOnly;
};
