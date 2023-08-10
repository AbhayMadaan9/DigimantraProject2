export const fetch_token = ()=>{
    const data = localStorage.getItem("access_token");
    return data;
}