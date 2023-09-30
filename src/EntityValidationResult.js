class EntityValidationResult {

    _fieldErrors;
    _hasErrors;

    constructor(invalidEntityDto) {

        if(invalidEntityDto) {

            if(invalidEntityDto["invalidFields"].length > 0) this._fieldErrors = true;

            let fieldErrors = [];

            for(const index in invalidEntityDto["invalidFields"]) {
                fieldErrors.push(
                    new FieldError(
                        invalidEntityDto["invalidFields"][index]["fieldName"],
                        invalidEntityDto["invalidFields"][index]["errorCode"],
                        invalidEntityDto["invalidFields"][index]["errorMessage"]
                    )
                );
            }

            this._fieldErrors = fieldErrors
        }
    }

    get fieldErrors() {
        return this._fieldErrors;
    }

    set fieldErrors(value) {
        this._fieldErrors = value;
    }


    get hasErrors() {
        return this._hasErrors;
    }

    set hasErrors(value) {
        this._hasErrors = value;
    }
}

export class FieldError {

    _fieldName;
    _errorCode;
    _errorMessage;

    constructor(fieldName, errorCode, errorMessage) {
        this._fieldName = fieldName;
        this._errorCode = errorCode;
        this._errorMessage = errorMessage;
    }

    get fieldName() {
        return this._fieldName;
    }

    set fieldName(value) {
        this._fieldName = value;
    }

    get errorCode() {
        return this._errorCode;
    }

    set errorCode(value) {
        this._errorCode = value;
    }

    get errorMessage() {
        return this._errorMessage;
    }

    set errorMessage(value) {
        this._errorMessage = value;
    }
}

export default EntityValidationResult;