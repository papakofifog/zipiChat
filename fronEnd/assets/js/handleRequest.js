export default async function sendData(url,data){
    let user_access_token=window.sessionStorage.getItem('access-token')
    let Headers= {
        headers: {
            authorization: user_access_token
        }
    }
    let response=await axios.post(url,data,Headers);

    return response;
}