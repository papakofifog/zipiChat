async function postRequest(url,data){
   await axios.post(url,data).then((received)=>{
    return received;
   }).catch((e)=>{
    console.error(e)
   });
}

function getFormData(){
    let arr=[];
    document.querySelectorAll('input').forEach((x)=>{
        if(x.type!='button' && x.id!='com-pass'){
            arr.push(x.value)
            
        }
    });
    return arr;
}

function registerUser(){
        let url='http://localhost:3000/api/signUp';
        let registerData= getFormData();
        let data = {
            firstname: registerData[0],
            lastname:registerData[1],
            Dob:registerData[2],
            username:registerData[3],
            email:registerData[4],
            password:registerData[5],

        }
        
        let results= postRequest(url,data);
        
    return results;


}

export { registerUser }