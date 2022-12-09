function getFormData(){
    let arr=[];
    document.querySelectorAll('input').forEach((x)=>{
        if(x.type!='button' && x.id!='com-pass'){
            arr.push(x.value)
            
        }
    });
    return arr;
}

async function registerUser(){
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
        
        let results= await postRequest(url,data);
        
        return results;


}

async function postRequest(url,data){
    let registerData=await axios.post(url,data);
    return registerData;
 
 }

export { registerUser }