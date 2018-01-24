import * as Ajv from "ajv";
import { SchemaValidator } from "./SchemaValidator";

export class SchemaValidatorProvider {
    private static SCHEMA_REF = "http://json-schema.org/draft-06/schema#";

    public getValidator( schema: object|any ): SchemaValidator {
        const schemaRef = SchemaValidatorProvider.SCHEMA_REF;

        if ( schema.$schema !== schemaRef ) {
            throw new Error(
                `$schema must be equal to ${schemaRef}`
            );
        }

        const ajv = new Ajv();

        ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-06.json"));

        return new SchemaValidator(
            schema,
            ajv
        );
    }
}
