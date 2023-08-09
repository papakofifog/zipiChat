

let zipiLogo=__dirname+"View/assets/zipichatlogo.png"

function EmailsTemplate(emailLink, firstName){
    return `
    <body style="
    font-size: 1.0rem;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    font-weight: 400;
        ">

            <div style="
            display: flex;
            flex-direction: column;
            ">

                <div class="
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;

                ">
                    <h3>Reset Your ZipiChat Password</h3>

                    <div>
                        <img src="${zipiLogo}" alt="appLogo">
                    </div>
                </div>

                <div style="
                display: flex; 
                margin-top: 0.5rem;
                flex-direction: column;
                align-items: center;
                ">
                    <h5>Hello ${firstName}</h5>
                    <p>We are sending you this email because you requested a password reset. 
                        Click on this link to create a new password:</p>
                    <a style="
                    padding: 2rem; 
                    background-color: rgb(133, 160, 233); 
                    color: #fff;
                    text-decoration: none;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    box-shadow: 1rem 1rem silver 0.5;
                    " href="${emailLink}"> Set a new Password</a>

                    <p>
                        if you didn't request a password reset, you can ignore this email. Your password will not be changed.
                    </p>

                    <h5>The ZipiChat Team</h5>
                </div>

            </div>

        </body>`;
}

module.exports=EmailsTemplate;