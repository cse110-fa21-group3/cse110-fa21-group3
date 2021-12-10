exports.handler = async (event, context) => {
    console.log("testing1")
    return {
        statusCode: 200,
        body: JSON.stringify({
        api: process.env.API_KEY
        }),
    }
}
