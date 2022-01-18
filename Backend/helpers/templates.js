
function confirmEmailTemplate(url){
    return (
`<div style="position: relative; overflow: auto; padding-bottom: 5px">
<div style="margin: 0px auto; width:100%; max-width: 500px; box-shadow: 3px 3px 10px 0 rgba(0,0,0,0.2)">
  
  <div style="width: 100%; background-color: rgb(45, 66, 99);">
    <div style="margin: 0px auto; padding: 25px 25px;">
      <div style="margin: 0px auto; position: relative; width: 100%; max-width: 200px;">
        <img alt="" src="http://soreing.site/logo.png" style="border: none; display: block; outline: none; text-decoration: none; height: auto; width: 100%;">
      </div>
    </div>
  </div>
  
  <div style="width: 100%; background-color: rgb(255, 255, 255);">
    <div style="padding: 25px 25px;">
      <span style="color:#5e6977; font-family:Arial; font-size:18px; line-height:20px;">Welcome to Notes App. Please confirm your email address by clicking on the button below.</span>
    </div>
  </div>
  
  <div style="width: 100%; background-color: rgb(255, 255, 255);">
    <div style="margin: 0px auto; padding: 25px 25px; text-align: center;">
      <a href="${url}">              
        <div style="background-color: rgb(45, 66, 99); border: none; cursor: pointer; display: inline-block; padding: 10px 25px;">
          <span style="color:#ffffff; font-family:Arial; font-size:14px; text-decoration: none;"><strong>CONFIRM EMAIL</strong></span>
        </div>
      </a>
    </div>
  </div>
  
  <div style="width: 100%; background-color: rgb(255, 255, 255);">
    <div style="padding: 25px 25px;">
      <p><span style="color:#5e6977; font-family:Arial; font-size:16px; line-height:15px;">If the button doesn't work, please copy paste the following link in your browser:</span></p>
      <p><span style="color:#5e6977; font-family:Arial; font-size:16px; line-height:15px;">${url}</span></p>
    </div>
  </div>
  
</div>
</div>`);
}

export {confirmEmailTemplate};

