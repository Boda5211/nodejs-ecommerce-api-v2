const nodemailer=require('nodemailer');

//Nodemailer
const sendEmail=async(option)=>{
    //1)create transporter (service that will send email like "gmail",Mailgun,mailtrap,sengrid)
    const transporter=nodemailer.createTransport({
        host:process.env.Email_Host,
        port:process.env.EMAIL_PORT,
        secure:true,
        auth:{
            user:process.env.EMAIL_UESR,
            pass:process.env.EMAIL_PASSWORD
        },
    });
    //2) Define email options (like from ,to,subject ,email content)
    const mailOpts={
        from:'E-shop App <abdullahmostafak@gmail.com>',
        to:option.email,
        subject:option.subject,
        text:option.message,
    };
    //3) Send email
    await transporter.sendMail(mailOpts);  
};

module.exports=sendEmail;