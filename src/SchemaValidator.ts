import * as Ajv from "ajv";

export class SchemaValidator {
    constructor(
        private schema: object|any,
        private validator: Ajv.Ajv
    ) {}

    public async validate( data: any ): Promise<boolean> {
        const isValid = this.validator.validate(this.schema, data);

        if ( ! isValid ) {
            throw new Error(JSON.stringify(this.validator.errors));
        }

        return isValid;
    }

    public getValidator(): Ajv.Ajv {
        return this.validator;
    }
}
