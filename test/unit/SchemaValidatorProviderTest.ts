import {assert as Assert } from "chai";
import {} from "mocha";
import {} from "node";
import * as sinon from "sinon";
import { SchemaProvider } from "../../src";
import { SchemaValidator } from "../../src/SchemaValidator";
import { SchemaValidatorProvider } from "../../src/SchemaValidatorProvider";

describe(`SchemaValidatorProvider`, function() {
    this.timeout(30000);

    describe(`getValidator`, function(){
        it(`should return a validator for the provided schema`, async function() {
            const sut = new SchemaValidatorProvider();

            const schemaProvider = new SchemaProvider({
                path: "test/samples/ISampleInterface.ts"
            });

            const schema = schemaProvider.getSchemaForSymbol("ISampleInterface");

            const validator = sut.getValidator(schema);

            Assert.isTrue(validator instanceof SchemaValidator);
        });
    });

});

