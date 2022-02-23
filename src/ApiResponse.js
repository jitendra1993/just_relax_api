
export class ApiResponse {

    constructor(data = null, status = 200, message = "SUCCESS") {
        this.status = status;
        this.message = message;
        this.data = data;        
    }

}
