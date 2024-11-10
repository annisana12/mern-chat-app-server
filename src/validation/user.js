const authSchema = () => {
    const schema = {
        email: {
            type: "email",
            normalize: true
        },
        password: {
            type: "string",
            empty: false,
            trim: true
        }
    };

    return schema;
};

export default {
    authSchema
}