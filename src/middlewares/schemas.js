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
    name : yup.string().required("Product's name is required").strict(), 
    description: yup.string(),
    price: yup.number("El precio deberia ser un numero").positive("Tu precio debe ser positivo").required("Product's price is required").strict(),
    photo: yup.string()
})

const statusOrderModificationSchema = yup.object({
    orderId: yup.number('orderId must be a number').integer('orderId must be integer').positive('orderId must be positive').required('OrderId is required').strict(),
    newStatus: yup.string().oneOf(['nuevo', 'confirmado', 'preparando', 'enviando', 'cancelado', 'entregado'])
})

const lastOrderModificationSchema = yup.object({
    address: yup.string().required(),
    payment_kind: yup.string().required(),
    orderId: yup.number('orderId must be a number').integer('orderId must be integer').positive('orderId must be positive').required('OrderId is required').strict()
})

const favoriteProductSchema = yup.object({
    productId: yup.number('productId must be a number').integer('productId must be integer').positive('productId must be positive').required('productId is required').strict()
})

const orderToProductSchema = yup.object({
    productId: yup.number('productId must be a number').integer('productId must be integer').positive('productId must be positive').required('productId is required').strict()
})

module.exports = {
    userSignUpSchema,
    userSignInSchema,
    productSchema,
    statusOrderModificationSchema,
    lastOrderModificationSchema,
    favoriteProductSchema,
    orderToProductSchema
}