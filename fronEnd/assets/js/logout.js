const logoutBtn= document.querySelector('#logout')

logoutBtn.addEventListener('click', ()=>{
    window.sessionStorage.removeItem('access-token');
    document.location.href='../../auth/login.html';
})