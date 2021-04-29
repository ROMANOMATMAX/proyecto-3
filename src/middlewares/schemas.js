const yup = require('yup');

const userSignUpSchema = yup.object({
    username: yup.string().required(),
    fullname: yup.string().required(),
    email: yup.string()
    .required("Email is required field")
    .matches(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, "Use a email valid format"),
    phone: yup.string(),
    address: yup.string().required(),
    password: yup.string().required("Password is required field"),
    role: yup.string().oneOf(['ADMIN', 'COSTUMER', ""])
})


const userSignInSchema = yup.object ({
    email: yup.string()
    .required("Email is required field")
    .matches(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, "Use a email valid format"),
    password: yup.string().required("Password is required field")
})

const productSchema = yup.object({
    name : yup.string().required("Product's name is required"), 
    description: yup.string(),
    price: yup.number("El precio deberia ser un numero").positive("Tu precio debe ser positivo").required("Product's price is required").strict(),
    photo: yup.string()
})

module.exports = {
    userSignUpSchema,
    userSignInSchema,
    productSchema
}