export let API: string

if (process.env.NODE_ENV === 'development') {
    console.log("接口地址", process.env)
    API = process.env.REACT_APP_DEVELOPMENT_API_URL || "qwer";
} else {
    API = process.env.REACT_APP_PRODUCTION_API_URL || "qwer";
}