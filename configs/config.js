const config = {
    production: {
        SECRET: process.env.SECRET,
        // DATABASE: process.env.MONGODB_URI

    },
    default: {
        SECRET: 'mysecretkey',
        // DATABASE: 'mongodb://localhost:27017/eduInternJan'
        DATABASE: 'mongodb+srv://Sagarbehera:Sagar456@cluster0.96hmj.mongodb.net/eduInternJan?retryWrites=true&w=majority'
    }
}
exports.get = function get(env) {
    return config[env] || config.default
}