
export const mocksConfigService = {
    get(key: string) {
        switch (key) {
            case "JWT_EXPIRATION_TIME":
                return '3600'
        }
    }
}