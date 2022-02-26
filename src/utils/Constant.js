let messages
if(process.env.NODE_ENV === 'production'){
     messages = {
        CURRENCY : '£',
        HOST:'https://just-relax.com/dev',
        CATEGORY_IMAGE_URL : '/uploads/files/',
        LOGO_IMAGE_URL : '/uploads/vendor_logo/',
        DEAFULT_CATEGORY_IMAGE_URL : '/uploads/files/default.png',
    };
}else{
     messages = {
        CURRENCY : '£',
        HOST:'http://localhost/just-relax/dev',
        CATEGORY_IMAGE_URL : '/uploads/files/',
        LOGO_IMAGE_URL : '/uploads/vendor_logo/',
        DEAFULT_CATEGORY_IMAGE_URL : '/uploads/files/default.png',
    };
}

export   {messages}