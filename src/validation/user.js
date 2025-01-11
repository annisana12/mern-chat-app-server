const authSchema = {
    email: {
        type: "email",
        normalize: true
    },
    password: {
        type: "string",
        empty: false,
        trim: true
    }
}

const profileSchema = {
    name: {
        type: "string",
        empty: false,
        trim: true
    },
    bgColor: {
        type: "string",
        empty: false,
        trim: true,
        lowercase: true
    }
}

export default {
    authSchema,
    profileSchema
}