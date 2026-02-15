//prebuild hai Error class phele se usi ko extend kar rhe h

// class ApiError extends Error{
    
        //constructor overriding
//     constructor(
//         statusCode,
//          message = "something went wrong",
//          error = [], 
//          stack = ""
//     ){
//         super(message)
//         this.statusCode = statusCode
//         this.data = null
//         this.message  = message
//         this.success = false;
//         this.errors = this.errors
        
//         if(stack)
//         {
//             this.stack = stack,

//         }
//         else{
//             Error.captureStackTrace(this, this.constructor)
//         }


//     }
// }

   //class export kardi

//agar api error  kabhi aaye to ese aayenge

class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message);

        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
