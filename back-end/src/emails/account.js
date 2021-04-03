const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY); //setup api key

const sendWelcomeEmail = (email,name) => {
    sgMail.send({
        to : email,
        from : 'katopodisaris@gmail.com',
        subject : 'Thanks for joining in!',
        text : `Welcome to the app, ${name}.Let me know how you get along with the app`
    })
};

const sendCancelationEmail = (email,name) => {
    sgMail.send({
        to : email ,
        from : 'katopodisaris@gmail.com',
        subject : 'Sorry to see you go!',
        text : `Goodbye, ${name}.Your account has been Deleted.Let us know what we could have done to imporve your user experience and keep you on board!`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}