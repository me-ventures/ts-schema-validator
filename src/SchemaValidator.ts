import * as Ajv from "ajv";

export class SchemaValidator {
    private customValidators: Map<string, (schema: object|any, data: object|any) => Promise<boolean>> = new Map();

    constructor(
        private schema: object|any,
        private validator: Ajv.Ajv
    ) {}

    public async validate( data: object|any ): Promise<boolean> {
        const isValid = this.validator.validate(this.schema, data);

        if ( ! isValid ) {
            throw new Error(JSON.stringify(this.validator.errors));
        }

        if ( this.customValidators.size > 0 ) {
            for ( const validatorName of this.customValidators.keys() ) {
                const validator = this.customValidators.get(validatorName);

                const customValidatorOk: boolean = await validator(
                    this.schema,
                    data
                );

                if ( ! customValidatorOk ) {
                    throw new Error(
                        `custom validation check [${validatorName}] failed`
                    );
                }
            }
        }

        return isValid;
    }

    public getValidator(): Ajv.Ajv {
        return this.validator;
    }

    public getSchema(): object|any {
        return this.schema;
    }

    public addCustomValidator(
        name: string,
        validator: (schema: object|any, data: object|any) => Promise<boolean>
    )
        : void
    {
        this.customValidators.set(name, validator);
    }

    public removeCustomValidator( name: string ): void {
        this.customValidators.delete(name);
    }
}


