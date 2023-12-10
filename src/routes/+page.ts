import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url, fetch }) => {

    console.log(url);

    console.log(url.port);
    let workaround_url = url.protocol + "//" + url.hostname + ":" + url.port + "/api/auth/info";
    console.log(workaround_url);

    console.log("START--" + workaround_url + "--END"); // http://localhost:3000/api/auth/info
    console.log(new URL(workaround_url).toString() === "http://localhost:3000/api/auth/info");

    let stra = "";
    let strb = "";

    for (let i = 0; i < workaround_url.length; i++) {
        console.log(workaround_url.charCodeAt(i) + "/" + workaround_url[i] + " ");
    }
    console.log('-------');
    for (let i = 0; i < "http://localhost:3000/api/auth/info".length; i++) {
        console.log("http://localhost:3000/api/auth/info".charCodeAt(i) + "/" + "http://localhost:3000/api/auth/info"[i] + " ");
    }

    let res = await fetch(workaround_url); // does not work (Error: Not found: /api/auth/info) ??
    let json = await res.json();

    return { json };
};