import {assert as Assert } from "chai";
import {} from "mocha";
import {} from "node";
import * as sinon from "sinon";
import { SchemaProvider } from "../../src";
import { SchemaValidator } from "../../src/SchemaValidator";
import { SchemaValidatorProvider } from "../../src/SchemaValidatorProvider";

describe(`SchemaValidator`, function() {
    this.timeout(30000);

    describe(`validate`, function(){
        it(`should return true for a valid schema`, async function(){
            const provider = new SchemaValidatorProvider();

            const schemaProvider = new SchemaProvider({
                path: "test/samples/ISampleInterface.ts"
            });

            const schema = schemaProvider.getSchemaForSymbol("ISampleInterface");

            const sut = provider.getValidator(schema);

            const result: boolean = await sut.validate({
                booleanThing: true,
                numberThing: 123,
                stringThing: "abc"
            });

            Assert.isTrue(result);
        });

        it(`should throw error for an invalid schema`, async function(){
            const provider = new SchemaValidatorProvider();

            const schemaProvider = new SchemaProvider({
                path: "test/samples/ISampleInterface.ts"
            });

            const schema = schemaProvider.getSchemaForSymbol("ISampleInterface");

            const sut = provider.getValidator(schema);

            try {
                await sut.validate({
                    booleanThing: "this should be a boolean",
                    numberThing: 123,
                    stringThing: "abc"
                });

                return Promise.reject("should not get here");
            }

            catch ( err ) {
                Assert.equal(err.message, `[{"keyword":"type","dataPath":".booleanThing","schemaPath":"#/properties/booleanThing/type","params":{"type":"boolean"},"message":"should be boolean"}]`);
            }
        });

        it(`should throw error for an invalid (empty) schema`, async function(){
            const provider = new SchemaValidatorProvider();

            const schemaProvider = new SchemaProvider({
                path: "test/samples/ISampleInterface.ts"
            });

            const schema: object|any = schemaProvider.getSchemaForSymbol("ISampleInterface");

            const sut = provider.getValidator(schema);

            try {
                await sut.validate({});

                return Promise.reject("should not get here");
            }

            catch ( err ) {
                Assert.equal(err.message, `[{"keyword":"type","dataPath":".booleanThing","schemaPath":"#/properties/booleanThing/type","params":{"type":"boolean"},"message":"should be boolean"}]`);
            }
        });

        it(`should throw error for an invalid (contains unknown field) schema`, async function(){
            const provider = new SchemaValidatorProvider();

            const schemaProvider = new SchemaProvider({
                path: "test/samples/ISampleInterface.ts"
            });

            const schema = schemaProvider.getSchemaForSymbol("ISampleInterface");

            const sut = provider.getValidator(schema);

            try {
                await sut.validate({
                    unknownField: "should be invalid"
                });

                return Promise.reject("should not get here");
            }

            catch ( err ) {
                Assert.equal(err.message, `[{"keyword":"type","dataPath":".booleanThing","schemaPath":"#/properties/booleanThing/type","params":{"type":"boolean"},"message":"should be boolean"}]`);
            }
        });
    });
});
