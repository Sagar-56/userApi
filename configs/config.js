const config = {
    production: {
        SECRET: process.env.SECRET,
        uri: process.env.MONGODB_URI?.toString()

    },
    default: {
        SECRET: 'mysecretkey',
        // uri: 'mongodb://localhost:27017/eduInternJan'
        uri: "mongodb+srv://Sagarbehera:Sagar456@cluster0.96hmj.mongodb.net/eduInternJan?retryWrites=true&w=majority"
    }
}
exports.get = function get(env) {
    return config[env] || config.default
}